import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LocalSearchBar } from '@/components/shared/SearchBar'
import QuestionCard from '@/components/shared/cards/QuestionCard'
import { Filter, HomeFilter } from '@/components/shared/Filter'
import { HomePageFilters } from '@/constants/filter'
import NoResult from '@/components/shared/NoResult'
import { getQuestions } from '@/lib/actions/question.action'
import Pagination from '@/components/shared/Pagination'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
}
const SearchSection = () => {
  return (
    <div className='flex gap-3 max-sm:flex-col'>
      <LocalSearchBar type='Question' />
      <div className='md:hidden'>
        <Filter filters={HomePageFilters} />
      </div>
    </div>
  )
}

const Home = async ({
  params, searchParams
}: {
  params: string,
  searchParams: {
    [key: string]: string | number | undefined
  }
}) => {
  const page = searchParams.page as number < 1 ? 1 : searchParams.page as number
  const { questions, isNext } = await getQuestions({
    searchQuery: decodeURI(searchParams.q as string ?? ""),
    filter: decodeURI(searchParams.filter as string ?? ""),
    page
  })
  return (
    <section className='flex w-full flex-col gap-8'>
      <div className='flex justify-between'>
        <h1 className='h1-bold text-dark100_light900'>All Questions</h1>
        <Link href='/ask-question'>
          <Button className='primary-gradient min-h-[46px] px-4 py-3 text-light-900'>Ask a Question</Button>
        </Link>
      </div>
      <SearchSection />
      <HomeFilter />
      {questions.length > 0 ? (
        questions.map((question) => (
          <QuestionCard
            key={question._id}
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
            title='There&apos;s no question to show'
            description='Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡'
            link='/ask-question'
            linkText='Ask a Question'
          />
        </div>
      )}
      <div className={questions.length === 0 ? 'hidden' : ''}>
        <Pagination page={page} isNext={isNext} />
      </div>
    </section>
  )
}

export default Home
