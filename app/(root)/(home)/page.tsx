import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {HomeSearchBar} from '@/components/shared/SearchBar'
import { questionTypes, mockQuestionData } from '@/constants/constants'
import { LargerRenderTag } from '@/components/shared/RenderTag'
import QuestionCard from '@/components/shared/QuestionCard'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SearchSection = () => {
  return (
    <div className='flex gap-3 max-sm:flex-col'>
      <HomeSearchBar />
      <div className='md:hidden'>
        <Select>
          <SelectTrigger className="background-light800_darkgradient text-dark400_light900 light-border h-full min-h-[56px] w-[180px] max-sm:w-full">
            <SelectValue placeholder="Select a Filter" />
          </SelectTrigger>
          <SelectContent className='background-light900_dark200 text-dark400_light900 light-border'>
            <SelectGroup>
              {questionTypes.map((type) => (
                <SelectItem className='hover:background-light800_dark300' key={type.title} value={`${type._id}`}>{type.title}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

const Home = () => {
  return (
    <section className='flex flex-col gap-8'>
      <div className='flex justify-between'>
        <h1 className='h1-bold text-dark100_light900'>All Questions</h1>
        <Link href='/ask-question'>
          <Button className='primary-gradient min-h-[46px] px-4 py-3 text-light-900'>Ask a Question</Button>
        </Link>
      </div>
      <SearchSection />
      <div className='flex gap-3 max-md:hidden'>
        {questionTypes.map((type) => (
          <LargerRenderTag key={type.title} _id={type._id} name={type.title} />
        ))}
      </div>
      {mockQuestionData.map((question) => (
        <QuestionCard key={question._id} question={question} />
      ))}
    </section>
  )
}

export default Home
