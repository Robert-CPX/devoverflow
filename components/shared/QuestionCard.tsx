import React from 'react'
import { Question } from '@/constants/index'
import { RenderTag } from './RenderTag'
import Image from 'next/image'

const DataItem = ({icon, number, unit}:{icon:string,number:number,unit:string}) => {
  return (
    <div className='flex-center gap-1'>
      <Image src={icon} alt={icon} width={16} height={16}/>
      <p className='small-medium text-dark400_light800'>{number} <span className='small-regular text-dark400_light800'>{unit}</span></p>
    </div>
  )
}

const QuestionCard = ({
  question
}:{
  question:Question
}) => {
  return (
    <div className="background-light900_darkgradient shadow-light100_dark100 flex w-full flex-col gap-3 rounded-lg px-11 py-9">
      <h3 className='h3-semibold text-dark200_light900 max-h-[50px] overflow-hidden'>{question.title}</h3>
      <div className='flex gap-2'>
        {question.tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.title} />
        ))}
      </div>
      <div className="mt-3 flex justify-between gap-2 max-[500px]:flex-col">
        <div className='flex justify-start gap-1'>
          <Image src={question.author.profilePic ?? '/assets/icons/avatar.svg'} alt="profile pic" width={20} height={20} className='rounded-full'/>
          <p className='text-dark400_light800 body-medium'>{question.author.name}<span className='text-dark400_light800 small-regular'> • asked 25 days ago</span></p>
        </div>
        <div className='flex gap-2'>
          <DataItem icon='/assets/icons/like.svg' number={question.voteNum} unit='Votes'/>
          <DataItem icon='/assets/icons/message.svg' number={question.answerNum} unit='Answers'/>
          <DataItem icon='/assets/icons/eye.svg' number={question.viewNum} unit='Views'/>
        </div>
      </div>
    </div>
  )
}

export default QuestionCard
