import {LocalSearchBar} from '@/components/shared/SearchBar'
import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { userFilterTypes , mockUsers } from '@/constants/constants'
import UserCard from '@/components/shared/UserCard'

const SearchSection = () => {
  return (
    <div className='flex gap-3 max-sm:flex-col'>
      <LocalSearchBar type='User' />
      <Select>
        <SelectTrigger className="background-light800_darkgradient text-dark400_light900 light-border h-full min-h-[56px] w-[180px] max-sm:w-full">
          <SelectValue placeholder="Select a Filter" />
        </SelectTrigger>
        <SelectContent className='background-light900_dark200 text-dark400_light900 light-border'>
          <SelectGroup>
            {userFilterTypes.map((type) => (
              <SelectItem className='hover:background-light800_dark300' key={type.title} value={`${type._id}`}>{type.title}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
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
