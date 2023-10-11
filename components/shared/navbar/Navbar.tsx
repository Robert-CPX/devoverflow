import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SignedIn, UserButton } from '@clerk/nextjs'
import Theme from './Theme'
import MobileNav from './MobileNav'
import { GlobalSearchBar } from '../SearchBar'

const Navbar = () => {
  return (
    <nav className='flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12'>
      <Link href="/" className='flex items-center gap-1'>
        <Image
          src="/assets/images/site-logo.svg"
          width={23}
          height={23}
          alt='devflow'
        />
        <p className='h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden'>Dev <span className='text-primary-500'>Overflow</span></p>
      </Link>
      <GlobalSearchBar />
      <div className='flex gap-2'>
        <Theme />
        <SignedIn>
          <UserButton
            afterSignOutUrl='/'
            appearance={{
              elements: {
                avatarBox: 'h-10 w-10'
              },
              variables: {
                colorPrimary: '#FF7000'
              }
            }}
          />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  )
}

export default Navbar
