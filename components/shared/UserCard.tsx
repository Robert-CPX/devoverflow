import React from 'react'
import Image from 'next/image'
import { User } from '@/constants/index'
import RenderTag from './RenderTag'

const UserCard = ({user}:{user:User}) => {
  return (
    <div className='flex-center light-border background-light900_dark200 shadow-light100_darknone h-[280px] w-[260px] flex-col gap-5 rounded-[10px] p-[30px]'>
      <Image src="/assets/icons/avatar.svg" alt='user picture' width={100} height={100} className='rounded-full'/>
      <h3 className='h3-bold text-dark200_light900'>{user.name}</h3>
      <p className='body-regular text-dark500_light500'>{`@${user.nickname}`}</p>
      <div className='flex items-center justify-between gap-2'>
        {user.tags.map((tag) => (
          <RenderTag key={tag.title} _id={tag._id} name={tag.title} customClassName="uppercase subtle-medium rounded-md px-4 py-2"/>
        ))}
      </div>
    </div>
  )
}

export default UserCard
