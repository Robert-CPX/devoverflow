import { QAStatsCard, BadgeStatsCard } from '@/components/shared/cards/StatsCard'
import UserDetailCard from '@/components/shared/cards/UserDetailCard'
import { Button } from '@/components/ui/button'
import { getAnswersByUser, getQuestionsByUser, getUserInfo } from '@/lib/actions/user.action'
import { auth, SignedIn } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import QuestionCard from '@/components/shared/cards/QuestionCard'
import NoResult from '@/components/shared/NoResult'
import Pagination from '@/components/shared/Pagination'
import { getBadges } from '@/lib/actions/badge.action'
import type { Metadata, ResolvingMetadata } from 'next'
import { redirect } from 'next/navigation'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: number | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  if (!params.id) redirect('/sign-in')
  const { user } = await getUserInfo({ userId: params.id })
  if (!user) redirect('/sign-in')
  return {
    title: user.username ?? "Profile",
    openGraph: {
      title: user.username ?? "Profile",
      description: 'The React Framework for the Web',
      url: `https://devstackoverflow.vercel.app/${user.clerkId}`,
      siteName: 'devoverflow',
      images: ["/assets/images/logo.png"],
      type: 'website',
    }
  }
}

const Page = async ({
  params, searchParams
}: Props) => {
  const { userId: clerkId } = auth()
  const page = searchParams.page ?? 1
  const { user, totalAnswers, totalQuestions } = await getUserInfo({ userId: params.id })
  const { questions: userQuestions, isNext: questionIsNext } = await getQuestionsByUser({ userId: user._id, page })
  const { answers: userAnswerdQuestions, isNext: answerIsNext } = await getAnswersByUser({ userId: user._id, page })
  const { bronze, silver, gold } = await getBadges({ userId: user._id })
  return (
    <section className='flex flex-col items-start gap-5'>
      <div className='relative flex w-full'>
        <UserDetailCard
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
        <BadgeStatsCard type="gold" count={gold} />
        <BadgeStatsCard type="silver" count={silver} />
        <BadgeStatsCard type="bronze" count={bronze} />
      </div>
      <div className='mt-3 flex w-full gap-10'>
        <Tabs defaultValue="top_posts" className="flex-1">
          <TabsList className='background-light800_dark400 min-h-[42px] p-1'>
            <TabsTrigger value="top_posts" className='tab'>Top Posts</TabsTrigger>
            <TabsTrigger value="answers" className='tab'>Answers</TabsTrigger>
          </TabsList>
          <TabsContent value="top_posts">
            <div className='flex w-full flex-col gap-6'>
              {userQuestions.length > 0 ? (
                userQuestions.map((question) => (
                  <QuestionCard
                    key={question._id}
                    clerkId={clerkId ?? ""}
                    _id={question._id}
                    title={question.title}
                    tags={question.tags.map((tag) => ({ _id: tag._id.toString(), name: tag.name }))}
                    author={question.author}
                    upvotes={question.upvotes.length}
                    views={question.views}
                    answers={question.answers.length}
                    createdAt={question.createdAt}
                    type='top_post'
                  />
                ))
              ) : (
                <div className='flex justify-center'>
                  <NoResult
                    title='There&apos;s no question to show'
                    description='Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡'
                    link='/ask-question'
                    linkText='Ask a Question'
                  />
                </div>
              )}
              <div className={`mt-2 flex ${userQuestions.length === 0 ? 'hidden' : ''}`}>
                <Pagination page={page} isNext={questionIsNext} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="answers">
            <div className='flex w-full flex-col gap-6'>
              {userAnswerdQuestions.length > 0 ? (
                userAnswerdQuestions.map((answer) => (
                  <QuestionCard
                    key={answer.question._id}
                    clerkId={clerkId ?? ""}
                    _id={answer.question._id}
                    title={answer.question.title}
                    author={answer.author}
                    views={answer.question.views}
                    createdAt={answer.createdAt}
                    type='answers'
                  />
                ))
              ) : (
                <div className='flex justify-center'>
                  <NoResult
                    title='There&apos;s no question to show'
                    description='Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡'
                    link='/ask-question'
                    linkText='Ask a Question'
                  />
                </div>
              )}
              <div className={`mt-2 flex ${userAnswerdQuestions.length === 0 ? 'hidden' : ''}`}>
                <Pagination page={page} isNext={answerIsNext} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

export default Page
