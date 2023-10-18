import { QAStatsCard, BadgeStatsCard } from '@/components/shared/cards/StatsCard'
import UserCard from '@/components/shared/cards/UserCard'
import { Button } from '@/components/ui/button'
import { getUserInfo } from '@/lib/actions/user.action'
import { SignedIn, auth } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Page = async ({ params }: { params: { id: string } }) => {
  const clerkId = auth().userId
  const { user, totalAnswers, totalQuestions } = await getUserInfo({ userId: params.id })
  return (
    <section className='flex flex-col items-start gap-5'>
      <div className='relative flex w-full'>
        <UserCard
          picture={user.picture}
          name={user.name}
          username={user.username}
          profileLink={user.profileLink}
          location={user.location}
          joinedAt={user.joinedAt}
          bio={user.bio}
        />
        <div className='absolute right-0 top-0'>
          <SignedIn>
            {clerkId === params.id && (
              <Link href='/profile/edit'>
                <Button className='flex-center light-border background-light800_dark400 paragraph-medium text-dark300_light900 min-h-[46px] w-[173px] rounded-lg border px-4 py-3'>Edit Profile</Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <h3 className='h3-semibold text-dark200_light900'>Stats</h3>
      <div className='grid w-full grid-cols-4 justify-start justify-items-stretch gap-5 max-md:grid-cols-2'>
        <QAStatsCard questions={totalQuestions} answers={totalAnswers} />
        <BadgeStatsCard type="gold" count={1} />
        <BadgeStatsCard type="silver" count={3} />
        <BadgeStatsCard type="bronze" count={5} />
      </div>
      <div className='mt-3 flex gap-10'>
        <Tabs defaultValue="top_posts" className="flex-1">
          <TabsList className='background-light800_dark400 min-h-[42px] p-1'>
            <TabsTrigger value="top_posts" className='tab'>Top Posts</TabsTrigger>
            <TabsTrigger value="answers" className='tab'>Answers</TabsTrigger>
          </TabsList>
          <TabsContent value="top_posts">Posts</TabsContent>
          <TabsContent value="answers">Answers</TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

export default Page
