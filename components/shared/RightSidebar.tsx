import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
import RenderTag from './RenderTag';
import { getTopQuestions } from '@/lib/actions/question.action';
import { getPopularTags } from '@/lib/actions/tag.action';

type TopQuestionsProp = {
  _id: string;
  title: string;
}

type PopularTagsProp = {
  _id: string;
  name: string;
  followers: string[];
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
            <Link href={`/question/${item._id}`} key={item.title} className='flex w-full cursor-pointer items-start justify-between gap-5'>
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
            <div key={item.name} className='flex h-[30px] w-full cursor-pointer items-center justify-between'>
              <RenderTag _id={item._id} name={item.name} customClassName="uppercase subtle-medium rounded-md px-4 py-2" />
              <p className='small-medium text-dark500_light700'>{item.followers.length}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

const RightSidebar = async () => {
  const topQuestions = await getTopQuestions()
  const popularTags = await getPopularTags()
  return (
    <aside className='background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[330px] flex-col items-start gap-6 overflow-y-auto border-l px-6 pb-8 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden'>
      <TopQuestions questions={topQuestions} />
      <PopularTags tags={popularTags} />
    </aside>
  )
}

export default RightSidebar
