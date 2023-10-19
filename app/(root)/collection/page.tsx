import { LocalSearchBar } from '@/components/shared/SearchBar'
import React from 'react'
import { Filter } from '@/components/shared/Filter'
import { QuestionFilters } from '@/constants/filter'
import { getSavedQuestions } from '@/lib/actions/user.action'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import NoResult from '@/components/shared/NoResult'
import QuestionCard from '@/components/shared/cards/QuestionCard'

const SearchSection = () => {
  return (
    <div className='flex gap-3 max-sm:flex-col'>
      <LocalSearchBar type='Question' />
      <Filter filters={QuestionFilters} />
    </div>
  )
}

const Page = async ({
  searchParams
}: {
  searchParams: {
    [key: string]: string | undefined
  }
}) => {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')
  const questions = await getSavedQuestions({
    clerkId: userId,
    searchQuery: decodeURI(searchParams.q ?? ""),
    filter: decodeURI(searchParams.filter ?? "")
  })

  return (
    <section className='flex flex-col gap-8'>
      <h1 className='h1-bold text-dark100_light900'>Saved Questions</h1>
      <SearchSection />
      {questions.length > 0 ? (
        questions.map((question) => (
          <QuestionCard
            key={question._id}
            clerkId={userId}
            _id={question._id}
            title={question.title}
            tags={question.tags.map((tag) => ({ _id: tag._id.toString(), name: tag.name }))}
            author={question.author}
            upvotes={question.upvotes.length}
            views={question.views}
            answers={question.answers.length}
            createdAt={question.createdAt}
          />
        ))
      ) : (
        <div className='flex justify-center'>
          <NoResult
            title='No Saved Questions Found'
            description='It appears that there are no saved questions in your collection at the moment 😔.Start exploring and saving questions that pique your interest 🌟'
            link='/'
            linkText='Explore Questions'
          />
        </div>
      )}
    </section >
  )
}

export default Page
