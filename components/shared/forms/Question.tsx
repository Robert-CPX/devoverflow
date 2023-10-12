'use client'

import React, { useRef, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Editor } from "@tinymce/tinymce-react"
import { QuestionFormSchema } from '@/lib/validations'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { createQuestion } from '@/lib/actions/question.action';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeProvider';

const type = 'edit'

const QuestionForm = ({ mongoUserId }: { mongoUserId: string }) => {
  const { theme } = useTheme()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const editorRef = useRef(null);
  const router = useRouter()
  const pathname = usePathname()

  // 1. Define your form.
  const form = useForm<z.infer<typeof QuestionFormSchema>>({
    resolver: zodResolver(QuestionFormSchema),
    defaultValues: {
      title: "",
      detail: "",
      tags: []
    },
  })

  const onSubmit = async (values: z.infer<typeof QuestionFormSchema>) => {
    setIsSubmitting(true)
    try {
      await createQuestion({
        title: values.title,
        content: values.detail,
        tags: values.tags,
        author: JSON.parse(mongoUserId),
        path: pathname
      })
      router.push('/');
    } catch (error) {

    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: any) => {
    if (e.key === 'Enter' && field.name === 'tags') {
      e.preventDefault()
      const tagInput = e.target as HTMLInputElement
      const tagValue = tagInput.value.trim()
      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError('tags', {
            type: 'required',
            message: 'Tag must be less than 15 characters'
          })
        }
        if (!field.value.includes(tagValue as never)) {
          form.setValue('tags', [...field.value, tagValue])
          tagInput.value = ""
          form.clearErrors('tags')
        }
      } else {
        form.trigger()
      }
    }
  }

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag)
    form.setValue('tags', newTags)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-10">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">Question Title <span className="paragraph-semibold text-warning">*</span></FormLabel>
              <FormControl>
                <Input className="light-border-2 background-light800_dark300 text-dark300_light800 rounded-md" {...field} />
              </FormControl>
              <FormDescription className="body-regular text-light-500">
                Be specific and imagine you&apos;re asking a question to another person.
              </FormDescription>
              <FormMessage className="text-warning" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="detail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">Detailed explanation of your problem? <span className="paragraph-semibold text-warning">*</span></FormLabel>
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
              <FormDescription className="body-regular text-light-500">
                Introduce the problem and expand on what you put in the title. Minimum 20 characters.
              </FormDescription>
              <FormMessage className="text-warning" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">Tags <span className="paragraph-semibold text-warning">*</span></FormLabel>
              <FormControl>
                <>
                  <Input className="light-border-2 background-light800_dark300 text-dark300_light800 rounded-md" placeholder='Add tag...' onKeyDown={(e) => {
                    handleInputKeyDown(e, field)
                  }} />
                  <div className='flex-start mt-2.5 gap-2.5'>
                    {field.value.map((tag, index) => (
                      <Badge key={tag} className='subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize' onClick={() => handleTagRemove(tag, field)}>
                        {tag}
                        <Image src="assets/icons/close.svg" alt='close icon' width={12} height={12} className='cursor-pointer object-contain invert-0 dark:invert' />
                      </Badge>
                    ))}
                  </div>
                </>
              </FormControl>
              <FormDescription className="body-regular text-light-500">
                Add up to 3 tags to describe what your question is about. You need to press enter to add a tag.
              </FormDescription>
              <FormMessage className="text-warning" />
            </FormItem>
          )}
        />
        <Button type="submit" className='primary-gradient min-h-[46px] max-w-[170px] self-end px-4 py-3 text-light-900' disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              {type === 'edit' ? 'Editing...' : 'Posting...'}
            </>
          ) : (
            <>
              {type === 'edit' ? 'Edit Question' : 'Ask a Question'}
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default QuestionForm
