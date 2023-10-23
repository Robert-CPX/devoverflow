import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

type JobCardProp = {
  icon: string;
  title: string;
  description: string;
  link: string;
  type: string;
  remuneration?: string;
  location: string;
}

const JobCard = ({ job }: { job: JobCardProp }) => {
  return (
    <article className='background-light900_dark300 light-border shadow-light100_darknone flex gap-6 rounded-lg p-7'>
      <Image
        className='rounded-[10px]'
        src={job.icon}
        width={64}
        height={64}
        alt="Job Icon"
      />
      <div className='flex flex-col gap-1'>
        <div className='flex items-center justify-between'>
          <p className='base-semibold text-dark200_light900'>{job.title}</p>
          <div className='background-light800_dark400 flex items-center gap-2 rounded-[16px] px-3 py-2'>
            <Image src='/assets/icons/stars.svg' alt='location' width={16} height={16} />
            <p className='body-medium text-dark400_light700'>{job.location}</p>
          </div>
        </div>
        <p className='body-regular text-dark500_light700 line-clamp-2 max-h-[40px]'>{job.description}</p>
        <div className='mt-4 flex items-center justify-between'>
          <div className='flex justify-start gap-6'>
            <div className='flex gap-1'>
              <Image src='/assets/icons/clock.svg' alt='job type' width={16} height={16} />
              <p className='body-medium text-light-500'>{job.type.toUpperCase()}</p>
            </div>
            <div className='flex gap-1'>
              <Image src='/assets/icons/currency-dollar-circle.svg' alt='job salary' width={16} height={16} />
              <p className='body-medium text-light-500'>{job.remuneration ?? "Not disclosed"}</p>
            </div>
          </div>
          <Link href={job.link} target='_blank' className='flex items-center gap-1'>
            <p className='body-semibold primary-text-gradient'>View job</p>
            <Image src='/assets/icons/arrow-up-right.svg' width={20} height={20} alt='arrow' />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default JobCard
