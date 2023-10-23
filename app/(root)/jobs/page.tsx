import { LocalSearchBar } from '@/components/shared/SearchBar'
import React from 'react'
import { Filter } from '@/components/shared/Filter'
import { QuestionFilters } from '@/constants/filter'
import NoResult from '@/components/shared/NoResult'
import Pagination from '@/components/shared/Pagination'
import JobCard from '@/components/shared/cards/JobCard'

const SearchSection = () => {
  return (
    <div className='flex gap-3 max-sm:flex-col'>
      <LocalSearchBar type='Job' />
      <Filter filters={QuestionFilters} />
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
  const { jobs, isNext } = {
    jobs:
      [
        { _id: "1", icon: "", title: "-- New Orleans, LA", description: "Build your career at Sazerac! With nearly four centuries of rich history, Sazerac Company has flourished as an independent, American family-owned company with operations in the United States", type: "full time", remuneration: "1", link: "https://bing.com", location: "-34.397, 150.644" },
        { _id: "2", icon: "", title: "-- New Orleans, LA", description: "Build your career at Sazerac! With nearly four centuries of rich history, Sazerac Company has flourished as an independent, American family-owned company with operations in the United States", type: "full time", link: "https://bing.com", location: "30.234, 120.666" },
      ],
    isNext: true
  }

  return (
    <section className='flex flex-col gap-8'>
      <h1 className='h1-bold text-dark100_light900'>Jobs</h1>
      <SearchSection />
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))
      ) : (
        <div className='flex justify-center'>
          <NoResult
            title='No Job Post Found'
            description='so sad'
            link='/'
            linkText='Explore Questions'
          />
        </div>
      )}
      <div className={jobs.length === 0 ? 'hidden' : ''}>
        <Pagination page={page} isNext={isNext} />
      </div>
    </section >
  )
}

export default Page
