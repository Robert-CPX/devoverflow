import { LocalSearchBar } from '@/components/shared/SearchBar'
import React from 'react'
import { Filter } from '@/components/shared/Filter'
import { TagFilters } from '@/constants/filter'
import { getAllTags } from '@/lib/actions/tag.action'
import TagCard from '@/components/shared/cards/TagCard'
import NoResult from '@/components/shared/NoResult'

const SearchSection = () => {
  return (
    <div className='flex gap-3 max-sm:flex-col'>
      <LocalSearchBar type='Tag' />
      <Filter filters={TagFilters} />
    </div>
  )
}

const Page = async () => {
  const allTags = await getAllTags({})
  return (
    <section className='flex flex-col gap-8'>
      <h1 className='h1-bold text-dark100_light900'>All Tags</h1>
      <SearchSection />
      {allTags.length > 0 ? (
        <div className='grid gap-5 min-[400px]:grid-cols-1 min-[550px]:grid-cols-2 min-[800px]:grid-cols-3'>
          {allTags.map((tag) => (
            <TagCard
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              description={tag.description}
              followers={tag.followers.length}
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
    </section >
  )
}

export default Page
