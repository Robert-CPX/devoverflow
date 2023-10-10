import React from 'react'
import Image from 'next/image'
import Link from 'next/link';

type NoResultProps = {
  title: string;
  description: string;
  link: string;
  linkText: string;
}

const NoResult = ({
  title,
  description,
  link,
  linkText
}: NoResultProps) => {
  return (
    <div className='flex-center mt-12 flex-col gap-7'>
      <Image
        src='/assets/images/light-illustration.png'
        alt="no result"
        width={200}
        height={200}
        className='object-contain dark:hidden'
      />
      <Image
        src='/assets/images/dark-illustration.png'
        alt="no result"
        width={200}
        height={200}
        className='hidden object-contain dark:flex'
      />
      <div className='flex-center flex-col gap-3'>
        <h2 className='h2-bold text-dark200_light900'>{title}</h2>
        <p className='body-regular text-dark500_light700 max-w-md text-center'>{description}</p>
        <Link href={link}>
          <p className='paragraph-medium primary-gradient w-[173px] rounded-lg px-4 py-3 text-center text-light-900'>{linkText}</p>
        </Link>
      </div>
    </div>
  )
}

export default NoResult
