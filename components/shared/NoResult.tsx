import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'

const NoResult = () => {
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
        <h2 className='h2-bold text-dark200_light900'>There&apos;s no question to show</h2>
        <p className='body-regular text-dark500_light700 max-w-md text-center'>Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡</p>
        <Button className='paragraph-medium primary-gradient w-[173px] rounded-lg px-4 py-3 text-light-900'>Ask a Question</Button>
      </div>
    </div>
  )
}

export default NoResult
