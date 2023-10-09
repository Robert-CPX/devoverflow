import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LocalSearchBar } from '@/components/shared/SearchBar'
import QuestionCard from '@/components/shared/cards/QuestionCard'
import Filter from '@/components/shared/Filter'
import { HomePageFilters } from '@/constants/filter'
import NoResult from '@/components/shared/NoResult'
import { getQuestions } from '@/lib/actions/question.action'
// import Pagination from '@/components/shared/Pagination'

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

const HomeFilter = () => {
  const active = ''

  return (
    <div className='flex gap-3 max-md:hidden'>
      {HomePageFilters.map((filter) => (
        <Button key={filter.value} className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none dark:bg-dark-300 ${active === filter.value ? " bg-primary-100 text-primary-500" : "bg-light-800 text-light-500"}`}>
          {filter.name}
        </Button>
      ))}
    </div>
  )
}

const Home = async () => {

  const result = await getQuestions({})
  return (
    <section className='flex flex-col gap-8'>
      <div className='flex justify-between'>
        <h1 className='h1-bold text-dark100_light900'>All Questions</h1>
        <Link href='/ask-question'>
          <Button className='primary-gradient min-h-[46px] px-4 py-3 text-light-900'>Ask a Question</Button>
        </Link>
      </div>
      <SearchSection />
      <HomeFilter />
      {result.questions.length > 0 ? (
        result.questions.map((question) => (
          <QuestionCard
            key={question._id}
            _id={question._id}
            title={question.title}
            tags={question.tags}
            author={question.author}
            upvotes={question.upvotes}
            views={question.views}
            answers={question.answers}
            createdAt={question.createdAt}
          />
        ))
      ) : (
        <div className='flex justify-center'>
          <NoResult />
        </div>
      )}
      {/* <Pagination /> */}
    </section>
  )
}

export default Home
