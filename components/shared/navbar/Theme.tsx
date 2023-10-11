'use client'

import React from 'react'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { useTheme } from '@/context/ThemeProvider'
import Image
  from 'next/image'
import { themes } from '@/constants/constants'
const Theme = () => {
  const { theme, setTheme } = useTheme()

  return (
    <Menubar className='relative border-none bg-transparent'>
      <MenubarMenu>
        <MenubarTrigger className='focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200'>
          {theme === "dark" ? (
            <Image src="/assets/icons/moon.svg" width={20} height={20} alt='dark theme' className='active-theme' />
          ) : (
            <Image src="/assets/icons/sun.svg" width={20} height={20} alt='light theme' className='active-theme' />)}
        </MenubarTrigger>
        <MenubarContent className='absolute right-[-3rem] mt-3 min-w-[120px] bg-light-900 py-2 dark:border-dark-400 dark:bg-dark-300'>
          {themes.map((item) => (
            <MenubarItem key={item.value} className='flex items-center gap-4 px-2.5 py-2 focus:bg-light-800 dark:focus:bg-dark-400' onClick={() => {
              if (item.value !== "system") {
                localStorage.theme = item.value
              } else {
                localStorage.removeItem("theme")
              }
              setTheme(item.value)
            }}>
              <Image
                src={item.icon}
                alt={item.value}
                width={16}
                height={16}
                className={`${theme === item.value && 'active-theme'}`}
              />
              <p className={`body-semibold text-light-500 ${theme === item.value ? 'text-primary-500' : 'text-dark100_light900'}`}>{item.label}</p>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export default Theme
