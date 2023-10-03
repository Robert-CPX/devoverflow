'use client'

import React, { useRef } from 'react';
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
import { QuestionsSchema } from '@/lib/validations'

const QuestionForm = () => { 
  const editorRef = useRef<Editor | null>(null);
  // 1. Define your form.
  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: "",
      detail: "",
      tags: [],
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  const TinyEditor = () => {
    return (
      <>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
          onInit={(evt, editor) => {
            // @ts-ignore
            editorRef.current = editor
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
            content_css: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default'),
            skin: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oxide-dark' : 'oxide'),
          }}
        />
      </>
    )
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
                <TinyEditor />
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
              <Input className="light-border-2 background-light800_dark300 text-dark300_light800 rounded-md" placeholder='Add tag...' {...field} />
              </FormControl>
              <FormDescription className="body-regular text-light-500">
              Add up to 3 tags to describe what your question is about. You need to press enter to add a tag.
              </FormDescription>
              <FormMessage className="text-warning" />
            </FormItem>
          )}
        />
        <Button type="submit" className='primary-gradient min-h-[46px] max-w-[170px] self-end px-4 py-3 text-light-900'>Ask a Question</Button>
      </form>
    </Form>
  )
}

export default QuestionForm
