import {LocalSearchBar} from '@/components/shared/SearchBar'
import React from 'react'
import { mockUsers } from '@/constants/constants'
import UserCard from '@/components/shared/UserCard'
import Filter from '@/components/shared/Filter'
import { UserFilters } from '@/constants/filter'

const SearchSection = () => {
  return (
    <div className='flex gap-3 max-sm:flex-col'>
      <LocalSearchBar type='User' />
      <Filter filters={UserFilters} />
    </div>
  )
}

const Page = () => {
  return (
    <section className='flex flex-col gap-8'>
      <h1 className='h1-bold text-dark100_light900'>All Users</h1>
      <SearchSection />
      <div className='grid gap-x-1 gap-y-9 max-lg:grid-cols-2 lg:grid-cols-3'>
        {mockUsers.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
    </section>
  )
}

export default Page
