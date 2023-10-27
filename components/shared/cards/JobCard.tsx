import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import RenderTag from '../RenderTag';

type JobCardProp = {
  icon: string | null;
  title: string;
  description: string;
  tag: boolean;
  link: string;
  type: string;
  remuneration?: string;
  location: string;
}

const JobCard = ({
  icon,
  title,
  description,
  tag,
  link,
  type,
  remuneration,
  location
}: JobCardProp) => {
  return (
    <article className='background-light900_dark200 light-border shadow-light100_darknone flex items-start gap-6 rounded-lg p-7'>
      <Image
        src={icon ?? '/assets/icons/no-image.svg'}
        className={`h-[64px] w-[64px] rounded-[10px] object-contain ${icon ?? 'invert-0 dark:invert'}`}
        width={64}
        height={64}
        alt="company logo"
      />
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <div className='flex max-w-[70%] items-start gap-3'>
            <p className='base-semibold text-dark200_light900'>{title}</p>
            {tag && <RenderTag name="Remote" customClassName='uppercase subtle-medium rounded-md px-4 py-2' />}
          </div>
          <div className='background-light800_dark400 flex items-center gap-2 rounded-[16px] px-3 py-2'>
            <Image src='/assets/icons/stars.svg' alt='location' width={16} height={16} />
            <p className='body-medium text-dark400_light700 line-clamp-1'>{location}</p>
          </div>
        </div>
        <p className='body-regular text-dark500_light700 line-clamp-2 max-h-[40px]'>{description}</p>
        <div className='mt-4 flex items-center justify-between'>
          <div className='flex justify-start gap-6'>
            <div className='flex gap-1'>
              <Image src='/assets/icons/clock.svg' alt='job type' width={16} height={16} />
              <p className='body-medium text-light-500'>{type.toUpperCase()}</p>
            </div>
            <div className='flex gap-1'>
              <Image src='/assets/icons/currency-dollar-circle.svg' alt='job salary' width={16} height={16} />
              <p className='body-medium text-light-500'>{remuneration ?? "Not disclosed"}</p>
            </div>
          </div>
          <Link href={link} target='_blank' className='flex items-center gap-1'>
            <p className='body-semibold primary-text-gradient'>View job</p>
            <Image src='/assets/icons/arrow-up-right.svg' width={20} height={20} alt='arrow' />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default JobCard
