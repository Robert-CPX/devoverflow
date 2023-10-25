'use client'

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"

import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EditProfileSchema } from '@/lib/validations'
import { updateUser } from '@/lib/actions/user.action';
import { usePathname, useRouter } from 'next/navigation';

type QuestionFormProps = {
  clerkId: string;
  user: string;
}

const EditProfileForm = ({
  clerkId, user
}: QuestionFormProps) => {
  // TODO: json to zod?
  const { name, username, profileLink, location, bio } = JSON.parse(user)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const form = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      name,
      username,
      profileLink,
      location,
      bio
    },
  })

  const onSubmit = async (values: z.infer<typeof EditProfileSchema>) => {
    setIsSubmitting(true)
    try {
      await updateUser({ clerkId, updateData: values, path: pathname })
      router.back()
      toast({ description: 'Profile updated successfully' })
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-10">
        <FormField
          control={form.control}
          name="name"
          defaultValue={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">Full Name<span className="paragraph-semibold text-warning">*</span></FormLabel>
              <FormControl>
                <Input placeholder='Your full name' className="paragraph-regular light-border-2 background-light800_dark300 text-dark300_light800 min-h-[53px] rounded-md px-6 py-4" {...field} />
              </FormControl>
              <FormMessage className="text-warning" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          defaultValue={username}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">Username<span className="paragraph-semibold text-warning">*</span></FormLabel>
              <FormControl>
                <Input placeholder='Your user name' className="paragraph-regular light-border-2 background-light800_dark300 text-dark300_light800 h-[53px] rounded-md px-6 py-4" {...field} />
              </FormControl>
              <FormMessage className="text-warning" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profileLink"
          defaultValue={profileLink}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">Portfolio Link</FormLabel>
              <FormControl>
                <Input className="paragraph-regular light-border-2 background-light800_dark300 text-dark300_light800 h-[53px] rounded-md px-6 py-4 text-accent-blue" {...field} />
              </FormControl>
              <FormMessage className="text-warning" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          defaultValue={location}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">Location<span className="paragraph-semibold text-warning">*</span></FormLabel>
              <FormControl>
                <Input className="light-border-2 background-light800_dark300 text-dark300_light800 h-[53px] rounded-md px-6 py-4" {...field} />
              </FormControl>
              <FormMessage className="text-warning" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          defaultValue={bio}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">Bio<span className="paragraph-semibold text-warning">*</span></FormLabel>
              <FormControl>
                <Textarea placeholder='What is special about you' className="paragraph-regular light-border-2 background-light800_dark300 text-dark300_light800 h-[120px] rounded-md px-6 py-4" {...field} />
              </FormControl>
              <FormMessage className="text-warning" />
            </FormItem>
          )}
        />
        <Button type="submit" className='primary-gradient min-h-[46px] max-w-[170px] self-end px-4 py-3 text-light-900' disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              {'Submitting...'}
            </>
          ) : (
            <>
              {'Submit'}
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default EditProfileForm
