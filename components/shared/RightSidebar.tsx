import React from 'react'
import Image from 'next/image'
import { mockPopularTags, mockTopQuestions } from '@/constants/constants'
import Link from 'next/link';
import RenderTag from './RenderTag';

type TopQuestionsProp = {
  _id: string;
  title: string;
  url: string;
}

type PopularTagsProp = {
  _id: string;
  title: string;
  ranking: number;
}

const TopQuestions = ({
  questions
}: {
  questions: TopQuestionsProp[]
}) => {
  return (
    <section className='flex w-full flex-col items-start gap-6'>
      <h3 className='h3-bold text-dark200_light900'>Top Questions</h3>
      <div className='flex w-full flex-col items-start gap-7'>
        {questions.map((item) => {
          return (
            <Link href={`/questions/${item._id}`} key={item.title} className='flex w-full cursor-pointer items-start justify-between gap-5'>
              <p className='body-medium text-dark500_light700 max-h-[54px] overflow-hidden text-ellipsis'>{item.title}</p>
              <Image src="/assets/icons/chevron-right.svg" alt='chevron right' width={20} height={20} className='invert-colors' />
            </Link>
          )
        })}
      </div>
    </section>
  )
}

const PopularTags = ({
  tags
}: {
  tags: PopularTagsProp[]
}) => {
  return (
    <section className='relative flex w-full flex-col items-start gap-6'>
      <h3 className='h3-bold text-dark200_light900'>Popular Tags</h3>
      <div className='flex w-full flex-col gap-4'>
        {tags.map((item) => {
          return (
            <div key={item.title} className='flex h-[30px] w-full cursor-pointer items-center justify-between'>
              <RenderTag _id={item._id} name={item.title} customClassName="uppercase subtle-medium rounded-md px-4 py-2" />
              <p className='small-medium text-dark500_light700'>{item.ranking}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

const RightSidebar = () => {
  return (
    <aside className='background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[330px] flex-col items-start gap-16 border-l px-6 pb-8 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden'>
      <TopQuestions questions={mockTopQuestions} />
      <PopularTags tags={mockPopularTags} />
    </aside>
  )
}

export default RightSidebar
