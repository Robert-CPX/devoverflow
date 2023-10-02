import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'

const GlobalSearch = () => {
  return (
    <div className='background-light800_darkgradient relative flex min-h-[56px] w-full max-w-[600px] items-center justify-start gap-1 rounded-lg px-4 max-lg:hidden'>
      <Image 
        src="./assets/icons/search.svg"
        width={23}
        height={23}
        alt='search'
      />
      <Input
        type='text'
        className='text-dark400_light900 no-focus placeholder paragraph-regular border-none bg-transparent outline-none'
        placeholder='Search anything globally'
      />
    </div>
  )
}

export default GlobalSearch
