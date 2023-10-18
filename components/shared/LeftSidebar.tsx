'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { sidebarLinks } from '@/constants/constants'
import { usePathname } from 'next/navigation'
import { SignedOut, useAuth } from '@clerk/nextjs'
import { Button } from '../ui/button'

const LeftSidebar = () => {
  const pathname = usePathname()
  const { userId } = useAuth()
  return (
    <section className='background-light900_dark200 light-border sticky left-0 top-0 flex h-screen w-fit flex-col items-start justify-between overflow-y-auto border-r px-6 pb-8 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[260px]'>
      <div className='flex w-full flex-col gap-y-6'>
        {sidebarLinks.map((item) => {
          const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;
          if (item.route === '/profile') {
            item.route = `/profile/${userId}`
          }
          return (
            <Link key={item.label} href={item.route} className={`${isActive ? 'primary-gradient rounded-lg text-light-900' : 'text-dark300_light900'} flex max-h-[56px] items-center justify-start gap-4 bg-transparent p-4`}>
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${isActive ? '' : 'invert-colors'}`}
              />
              <p className={`${isActive ? 'base-bold' : 'base-medium'} max-lg:hidden`}>{item.label}</p>
            </Link>
          )
        })}
      </div>
      <SignedOut>
        <div className='flex w-full flex-col gap-y-3'>
          <Link href="/sign-in">
            <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image src="/assets/icons/account.svg" alt='account' width={20} height={20} className='lg:hidden' />
              <span className='primary-text-gradient max-lg:hidden'>Log In</span>
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image src="/assets/icons/sign-up.svg" alt='signup' width={20} height={20} className='lg:hidden' />
              <p className='max-lg:hidden'>Sign Up</p>
            </Button>
          </Link>
        </div>
      </SignedOut>
    </section>
  )
}

export default LeftSidebar
