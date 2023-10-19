import QuestionForm from '@/components/shared/forms/Question'
import { getQuestionById } from '@/lib/actions/question.action'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = async ({
  params
}: {
  params: { id: string }
}) => {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')
  const question = await getQuestionById({ questionId: params.id })

  return (
    <section>
      <h1 className='h1-bold text-dark100_light900'>Edit Question</h1>
      <div className='mt-9'>
        <QuestionForm
          mongoUserId={question.author._id}
          questionId={question._id}
          title={question.title}
          detail={question.content}
          tags={question.tags.map(tag => tag.name)}
          mode='edit'
        />
      </div>
    </section>
  )
}

export default Page
