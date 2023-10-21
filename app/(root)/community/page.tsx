import { LocalSearchBar } from '@/components/shared/SearchBar'
import React from 'react'
import { Filter } from '@/components/shared/Filter'
import UserCard from '@/components/shared/UserCard'
import { UserFilters } from '@/constants/filter'
import { getAllUsers } from '@/lib/actions/user.action'
import NoCommunity from '@/components/shared/NoCommunity'
import Pagination from '@/components/shared/Pagination'

const SearchSection = () => {
  return (
    <div className='flex gap-3 max-sm:flex-col'>
      <LocalSearchBar type='User' />
      <Filter filters={UserFilters} />
    </div>
  )
}

const Page = async ({
  searchParams
}: {
  searchParams: {
    [key: string]: string | number
  }
}) => {
  const page = searchParams.page as number < 1 ? 1 : searchParams.page as number
  const { allUsers, isNext } = await getAllUsers({
    searchQuery: decodeURI(searchParams.q as string ?? ""),
    filter: decodeURI(searchParams.filter as string ?? ""),
    page
  })
  return (
    <section className='flex flex-col gap-8'>
      <h1 className='h1-bold text-dark100_light900'>All Users</h1>
      <SearchSection />
      {allUsers.length > 0 ? (
        <div className='flex w-full flex-wrap justify-start gap-5'>
          {allUsers.map((user) => (
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
      <div className={allUsers.length === 0 ? 'hidden' : ''}>
        <Pagination page={page} isNext={isNext} />
      </div>
    </section >
  )
}

export default Page
