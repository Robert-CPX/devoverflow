'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { sidebarLinks } from '@/constants/constants'
import { usePathname } from 'next/navigation'

const LeftSidebar = ({isMobile = false}) => {
  const pathname = usePathname()
  return (
    <div className='background-light900_dark200 flex flex-col items-start gap-y-6 border-none pt-28'>
      {sidebarLinks.map((item) => (
        <Link key={item.label} href={item.route} className={`flex h-[56px] w-full items-center justify-start gap-3 rounded-lg border-none p-4 ${pathname.includes(item.imgURL) ?? 'primary-gradient'}`}>
          <Image
            src={item.imgURL}
            alt={item.label}
            width={20}
            height={20}
            className='border-none text-dark-100 dark:text-light-900'
          />
          <p className='paragraph-semibold text-dark-300 dark:text-light-900'>{item.label}</p>
        </Link>
      ))}

    </div>
  )
}

export default LeftSidebar
