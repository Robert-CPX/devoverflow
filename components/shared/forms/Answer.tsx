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
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Editor } from "@tinymce/tinymce-react"
import { AnswerFormSchema } from '@/lib/validations'
import { usePathname } from 'next/navigation';
import { createAnswer } from '@/lib/actions/answer.action';
import Image from 'next/image'
import { useTheme } from '@/context/ThemeProvider';
import { ReloadIcon } from '@radix-ui/react-icons';
import { toast } from '@/components/ui/use-toast';

type AnswerFormProps = {
  question: string,
  questionId: string,
  userId: string,
}

const AnswerForm = ({ question, questionId, userId }: AnswerFormProps) => {
  const { theme } = useTheme()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmittingAIAnswer, setIsSubmittingAIAnswer] = useState(false)
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
    setIsSubmitting(true)
    try {
      await createAnswer({
        content: values.answer,
        author: userId,
        question: questionId,
        path: pathname,
      })
      form.reset()
      if (editorRef.current) {
        const editor = editorRef.current as any
        editor.setContent('')
      }
      toast({ description: 'Answer posted successfully' })
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateAIAnswer = async () => {
    setIsSubmittingAIAnswer(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`, {
        method: 'POST',
        body: JSON.stringify({ question }),
      })
      const data = await response.json()
      const formattedData = data.answer.replace(/\n/g, '<br />')
      if (editorRef.current) {
        const editor = editorRef.current as any
        editor.setContent(formattedData)
      }
      toast({ description: 'AI Answer generated successfully' })
    } catch (error) {
      toast({
        variant: "destructive",
        description: 'Generate AI Answer failed :('
      })
      throw error
    } finally {
      setIsSubmittingAIAnswer(false)
    }
  }

  return (
    <div className='flex w-full flex-col gap-[18px]'>
      <div className='flex items-center justify-between'>
        <p className='paragraph-semibold text-dark400_light800'>Write your answer here</p>
        <Button className='flex-center background-light800_dark300 mb-[18px] gap-1 rounded-md border border-light-700 px-4 py-[10px] dark:border-dark-400' disabled={isSubmittingAIAnswer} onClick={generateAIAnswer}>
          {isSubmittingAIAnswer ? (
            <>
              <ReloadIcon className='my-2 h-3 w-3 animate-spin text-primary-500' />
              <p className='small-medium text-primary-500'>Generateing...</p>
            </>
          ) : (
            <>
              <Image className='object-contain' src="/assets/icons/stars.svg" alt="stars" width={12} height={12} />
              <p className='small-medium text-primary-500'>Generate AI answer</p>
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-7">
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
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
    </div >
  )
}

export default AnswerForm
