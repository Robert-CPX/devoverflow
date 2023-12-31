import React from 'react'
import RenderTag from '../RenderTag'
import Image from 'next/image'
import Link from 'next/link'
import { getTimeStamp } from '@/lib/utils'
import QAEdit from '../QAEdit'
import { SignedIn } from '@clerk/nextjs'

type QuestionCardProps = {
  clerkId?: string;
  _id: string;
  title: string;
  tags?: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
  };
  upvotes?: number;
  views: number;
  answers?: number;
  createdAt: Date;
  type?: 'top_post' | 'answers';
}

const Actiontem = ({ icon, number, unit }: { icon: string, number: number, unit: string }) => {
  return (
    <div className='flex-center gap-1'>
      <Image src={icon} alt={unit} width={16} height={16} />
      <p className='small-medium text-dark400_light800'>{number} <span className='small-regular text-dark400_light800'>{unit}</span></p>
    </div>
  )
}

const QuestionCard = ({
  clerkId,
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
  type,
}: QuestionCardProps) => {
  return (
    <div className="background-light900_darkgradient shadow-light100_dark100 flex w-full flex-col gap-3 rounded-lg px-11 py-9">
      <p className='text-dark400_light800 small-regular sm:hidden'>{`${getTimeStamp(createdAt)}`}</p>
      <div className='flex items-start justify-between gap-3'>
        <Link href={`/question/${_id}`} className='cursor-pointer'>
          <h3 className='h3-semibold text-dark200_light900 line-clamp-2 max-h-[50px]'>{title}</h3>
        </Link>
        {type !== undefined && (
          <SignedIn>
            <QAEdit itemId={_id} type={type ?? "top_post"} />
          </SignedIn>
        )}
      </div>
      <div className={`flex gap-2 ${type === 'answers' ? 'hidden' : ''}`}>
        {tags?.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} customClassName="uppercase subtle-medium rounded-md px-4 py-2" />
        ))}
      </div>
      <div className="mt-3 flex justify-between gap-2 max-md:flex-col">
        <Link href={`/profile/${author.clerkId}`} className='flex cursor-pointer justify-start gap-1'>
          <Image src={author.picture} alt="profile pic" width={20} height={20} className='rounded-full' />
          <p className='text-dark400_light800 body-medium line-clamp-1'>{author.name}<span className='text-dark400_light800 small-regular max-sm:hidden'> {`• ${getTimeStamp(createdAt)}`}</span></p>
        </Link>
        <div className='flex gap-2'>
          <Actiontem icon='/assets/icons/like.svg' number={upvotes ?? 0} unit='Votes' />
          {type !== 'answers' && (
            <>
              <Actiontem icon='/assets/icons/message.svg' number={answers ?? 0} unit='Answers' />
              <Actiontem icon='/assets/icons/eye.svg' number={views} unit='Views' />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuestionCard
