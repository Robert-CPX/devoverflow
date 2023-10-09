import Question from '@/components/shared/forms/Question'
import { getUsereById } from '@/lib/actions/user.action'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = async () => {
  // const { userId } = auth()
  const userId = '12345678'
  if (!userId) redirect('/sign-in')

  const mongoUser = await getUsereById(userId)

  console.log(mongoUser)

  return (
    <section>
      <h1 className='h1-bold text-dark100_light900'>Ask a question</h1>
      <div className='mt-9'>
        <Question mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </section>
  )
}

export default Page
