import React from 'react'
import Image from 'next/image'
// import RenderTag from './RenderTag';
import Link from 'next/link';
// import { getTopInteractedTags } from '@/lib/actions/tag.action';

type UserCardProps = {
  _id: string;
  picture: string;
  name: string;
  username: string;
}

const UserCard = async ({
  _id, picture, name, username
}: UserCardProps) => {
  // const interactedTags = await getTopInteractedTags({ userId: _id })

  return (
    <Link href={`/profile/${_id}`} className='flex-center light-border background-light900_dark200 shadow-light100_darknone h-[280px] w-[260px] flex-col gap-5 rounded-[10px] border p-[30px]'>
      <Image src={picture} alt='user picture' width={100} height={100} className='rounded-full' />
      <h3 className='h3-bold text-dark200_light900'>{name}</h3>
      <p className='body-regular text-dark500_light500'>@{username}</p>
      {/* <div className='flex items-center gap-2'>
        {interactedTags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} customClassName="uppercase subtle-medium rounded-md px-4 py-2" />
        ))}
      </div> */}
    </Link>
  )
}

export default UserCard
