import React from 'react'
import { LocalSearchBar } from '@/components/shared/SearchBar'
import QuestionCard from '@/components/shared/cards/QuestionCard'
import NoResult from '@/components/shared/NoResult'
import { getQuestionsByTagId } from '@/lib/actions/tag.action'
import Pagination from '@/components/shared/Pagination'

const Page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | number | undefined }
}) => {
  const page = searchParams.page as number < 1 ? 1 : searchParams.page as number
  const { name, questions, isNext } = await getQuestionsByTagId({
    tagId: params.id,
    page,
    searchQuery: decodeURI(searchParams.q as string ?? '')
  })
  return (
    <section className='flex flex-col gap-8'>
      <h1 className='h1-bold text-dark100_light900'>{name}</h1>
      <LocalSearchBar type='Tag' />
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

export default Page
