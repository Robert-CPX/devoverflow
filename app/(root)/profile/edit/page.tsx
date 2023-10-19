import EditProfileForm from '@/components/shared/forms/EditProfile'
import { getUsereById } from '@/lib/actions/user.action'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = async () => {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')
  const mongoUser = await getUsereById({ userId })
  return (
    <section>
      <h1 className='h1-bold text-dark100_light900'>Edit Profile</h1>
      <div className='mt-9'>
        <EditProfileForm
          clerkId={userId}
          user={JSON.stringify(mongoUser)}
        />
      </div>
    </section>
  )
}

export default Page
