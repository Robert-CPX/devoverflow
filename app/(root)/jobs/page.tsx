import { LocalSearchBar } from '@/components/shared/SearchBar'
import React from 'react'
import { Filter } from '@/components/shared/Filter'
import NoResult from '@/components/shared/NoResult'
import Pagination from '@/components/shared/Pagination'
import JobCard from '@/components/shared/cards/JobCard'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { getAllCountries, getJobs } from '@/lib/actions/job.action'

export const metadata: Metadata = {
  title: 'Jobs',
}

const SearchSection = ({ countries }: { countries: { name: string, value: string }[] }) => {
  return (
    <div className='flex gap-4 max-sm:flex-col'>
      <div className='grow'>
        <LocalSearchBar type='Job' />
      </div>
      <Filter filters={countries} customClassName='job-search min-w-[200px] grow' />
      <Button type="submit" className='primary-gradient min-h-[56px] w-[170px] px-4 py-3 text-light-900'>
        Find Jobs
      </Button>
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
  const query = searchParams.q as string
  const page = searchParams.page as number < 1 ? 1 : searchParams.page as number
  const pageSize = searchParams.pageSize as number < 1 ? 1 : searchParams.pageSize as number
  const country = searchParams.filter as string
  const { jobs, isNext } = await getJobs({ query, page, pageSize, country })
  const countries = await getAllCountries()

  return (
    <section className='flex flex-col gap-8'>
      <h1 className='h1-bold text-dark100_light900'>Design</h1>
      <SearchSection countries={countries} />
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <JobCard
            key={job.job_id}
            title={job.job_title}
            description={job.job_description}
            icon={job.employer_logo}
            link={job.job_apply_link}
            location={`${job.job_city},${job.job_country}`}
            type={job.job_employment_type}
            remuneration={`${job.job_min_salary && job.job_max_salary ? `${job.job_min_salary} - ${job.job_max_salary}` : 'Not disclosed'}`}
            tag={job.job_is_remote}
          />
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
