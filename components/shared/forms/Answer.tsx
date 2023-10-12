'use client'

import React, { useRef, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Editor } from "@tinymce/tinymce-react"
import { AnswerFormSchema } from '@/lib/validations'
import { usePathname } from 'next/navigation';
import { createAnswer } from '@/lib/actions/answer.action';
import Image from 'next/image'
import { useTheme } from '@/context/ThemeProvider';

const AnswerForm = ({ questionId, userId }: { questionId: string, userId: string | null }) => {
  const { theme } = useTheme()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const editorRef = useRef(null);
  const pathname = usePathname()

  // 1. Define your form.
  const form = useForm<z.infer<typeof AnswerFormSchema>>({
    resolver: zodResolver(AnswerFormSchema),
    defaultValues: {
      answer: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof AnswerFormSchema>) => {
    if (!userId) return
    setIsSubmitting(true)
    try {
      await createAnswer({
        content: values.answer,
        author: userId,
        question: questionId,
        path: pathname,
      })
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-10">
        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-between">
                <p className='paragraph-semibold text-dark400_light800'>Write your answer here</p>
                <Button className='flex-center background-light800_dark300 mb-[18px] gap-1 rounded-md border border-light-700 px-4 py-[10px] dark:border-dark-400'>
                  <Image className='object-contain' src="/assets/icons/stars.svg" alt="stars" width={12} height={12} />
                  <p className='small-medium text-primary-500'>Generate AI answer</p>
                </Button>
              </FormLabel>
              <FormControl>
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
                  onInit={(evt, editor) => {
                    // @ts-ignore
                    editorRef.current = editor
                  }}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => {
                    field.onChange(content)
                  }}
                  initialValue=''
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                      'anchor', 'searchreplace', 'visualblocks', 'codesample', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                      'codesample | bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist',
                    content_style: 'body { font-family:Inter; font-size:16px;}',
                    skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
                    content_css: theme === 'dark' ? 'dark' : 'light',
                  }}
                />
              </FormControl>
              <FormMessage className="text-warning" />
            </FormItem>
          )}
        />
        <Button type="submit" className='primary-gradient min-h-[46px] max-w-[170px] self-end px-4 py-3 text-light-900' disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              {'Posting...'}
            </>
          ) : (
            <>
              {'Post Answer'}
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default AnswerForm
