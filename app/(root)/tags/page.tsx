import { LocalSearchBar } from '@/components/shared/SearchBar'
import React from 'react'
import { Filter } from '@/components/shared/Filter'
import { TagFilters } from '@/constants/filter'
import { getAllTags } from '@/lib/actions/tag.action'
import TagCard from '@/components/shared/cards/TagCard'
import NoResult from '@/components/shared/NoResult'
import Pagination from '@/components/shared/Pagination'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Tags',
}

const SearchSection = () => {
  return (
    <div className='flex gap-3 max-sm:flex-col'>
      <LocalSearchBar type='Tag' />
      <Filter filters={TagFilters} />
    </div>
  )
}

const Page = async ({
  searchParams
}: {
  searchParams: {
    [key: string]: string | number | undefined
  }
}) => {
  const page = searchParams.page as number < 1 ? 1 : searchParams.page as number
  const { allTags, isNext } = await getAllTags({
    page,
    searchQuery: decodeURI(searchParams.q as string ?? ""),
    filter: decodeURI(searchParams.filter as string ?? "")
  })
  return (
    <section className='flex flex-col gap-8'>
      <h1 className='h1-bold text-dark100_light900'>All Tags</h1>
      <SearchSection />
      {allTags.length > 0 ? (
        <div className='flex flex-wrap justify-start gap-5'>
          {allTags.map((tag) => (
            <TagCard
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              description={tag.description}
              followers={tag.questions.length}
            />
          ))}
        </div>
      ) : (
        <NoResult
          title='No tags found'
          description='It looks like there are no tags found'
          link='/ask-question'
          linkText='Ask a Question'
        />
      )}
      <div className={allTags.length === 0 ? 'hidden' : ''}>
        <Pagination page={page} isNext={isNext} />
      </div>
    </section >
  )
}

export default Page
