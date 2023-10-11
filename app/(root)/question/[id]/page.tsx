import React from 'react'
import { getQuestionById } from '@/lib/actions/question.action'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { getTimeStamp } from '@/lib/utils'
import Link from 'next/link'
import ParseHTML from '@/components/shared/ParseHTML'
import RenderTag from '@/components/shared/RenderTag'
import Filter from '@/components/shared/Filter'
import { AnswerFilters } from '@/constants/filter'

const Towards = ({
  upvoted, downvoted, collected
}: {
  upvoted: boolean, downvoted: boolean, collected: boolean
}) => (
  <div className='flex-center gap-[10px]'>
    <div className='flex-center gap-[6px]'>
      <Button variant="outline" size="icon" className='h-[18px] w-[18px] border-none'>
        <Image src={`/assets/icons/${upvoted ? "upvoted" : "upvote"}.svg`} alt="upvote icon" width={18} height={18} />
      </Button>
      <p className='subtle-medium text-dark400_light900 background-light700_dark400 rounded-sm p-1'>12</p>
    </div>
    <div className='flex-center gap-[6px]'>
      <Button variant="outline" size="icon" className='h-[18px] w-[18px] border-none'>
        <Image src={`/assets/icons/${downvoted ? "downvoted" : "downvote"}.svg`} alt="downvote icon" width={18} height={18} />
      </Button>
      <p className='subtle-medium text-dark400_light900 background-light700_dark400 rounded-sm p-1'>12</p>
    </div>
    <Button variant="outline" size="icon" className='ml-[6px] h-[18px] w-[18px] border-none'>
      <Image src={`/assets/icons/${collected ? "star-filled" : "star-red"}.svg`} alt='star icon' width={18} height={18} />
    </Button>
  </div>
)

const Influence = ({ asked, answers, views, votes }: { asked: string, answers: number, views: number, votes: number }) => (
  <div className='flex justify-start gap-4'>
    <div className='flex gap-1'>
      <Image src="/assets/icons/clock.svg" alt='clock icon' width={14} height={14} />
      <p className='small-regular text-dark400_light700'>{`Asked ${asked}`}</p>
    </div>
    <div className={`flex gap-1 ${votes === 0 ?? 'hidden'}`}>
      <Image src="/assets/icons/like.svg" alt='like icon' width={16} height={16} />
      <p className='small-regular text-dark400_light700'>{`${votes} Votes`}</p>
    </div>
    <div className={`flex gap-1 ${answers === 0 ?? 'hidden'}`}>
      <Image src="/assets/icons/message.svg" alt='message icon' width={16} height={16} />
      <p className='small-regular text-dark400_light700'>{`${answers} Answers`}</p>
    </div>
    <div className={`flex gap-1 ${views === 0 ?? 'hidden'}`}>
      <Image src="/assets/icons/eye.svg" alt='eye icon' width={16} height={16} />
      <p className='small-regular text-dark400_light700'>{`${views} Views`}</p>
    </div>
  </div>
)

const Page = async ({ params }: { params: { id: string } }) => {
  const question = await getQuestionById({ questionId: params.id })

  return (
    <article className='flex w-full flex-col justify-start gap-[16px]'>
      <div className='mt-3 flex justify-between'>
        <Link href={`/profile/${question.author._id}`} className='flex-center gap-1'>
          <Image src={question.author.picture} alt="profile" width={22} height={22} className='rounded-full' />
          <p className='paragraph-semibold text-dark300_light700'>{question.author.name}</p>
        </Link>
        <Towards upvoted downvoted={false} collected={false} />
      </div>
      <h2 className='h2-semibold text-dark200_light900 mt-1'>{question.title}</h2>
      <Influence asked={getTimeStamp(question.createdAt)} answers={question.answers.length} views={question.views} votes={0} />
      <ParseHTML data={question.content} />
      <div className='mt-3 flex gap-2'>
        {question.tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} customClassName="uppercase subtle-medium rounded-md px-4 py-2" />
        ))}
      </div>
      <div className='flex items-center justify-between'>
        <p className='paragraph-medium primary-text-gradient'>{`${question.answers.length} Answers`}</p>
        <Filter filters={AnswerFilters} />
      </div>
    </article>
  )
}

export default Page
