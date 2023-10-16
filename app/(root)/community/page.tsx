import { LocalSearchBar } from '@/components/shared/SearchBar'
import React from 'react'
import Filter from '@/components/shared/Filter'
import UserCard from '@/components/shared/UserCard'
import { UserFilters } from '@/constants/filter'
import { getAllUsers } from '@/lib/actions/user.action'
import NoCommunity from '@/components/shared/NoCommunity'

const SearchSection = () => {
  return (
    <div className='flex gap-3 max-sm:flex-col'>
      <LocalSearchBar type='User' />
      <Filter filters={UserFilters} />
    </div>
  )
}

const Page = async () => {
  const result = await getAllUsers({})
  return (
    <section className='flex flex-col gap-8'>
      <h1 className='h1-bold text-dark100_light900'>All Users</h1>
      <SearchSection />
      {result.parsedAllUsers.data.length > 0 ? (
        <div className='grid gap-5 min-[400px]:grid-cols-1 min-[550px]:grid-cols-2 min-[800px]:grid-cols-3'>
          {result.parsedAllUsers.data.map((user) => (
            <UserCard key={user._id}
              _id={user._id}
              picture={user.picture}
              name={user.name}
              username={user.username}
            />
          ))}
        </div>
      ) : (
        <NoCommunity />
      )}
    </section >
  )
}

export default Page
