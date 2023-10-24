'use client'

import React, { useEffect, useRef, useState } from 'react'
import { globalSearchTypes } from '@/constants/constants'
import GlobalSearchType from './GlobalSearchType'
import { ReloadIcon } from '@radix-ui/react-icons'
import { getGlobalSearchResult } from '@/lib/actions/user.action'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type GlobalSearchResultProps = {
  show: boolean;
  handleClickOutside: () => void
}

const GlobalSearchResult = ({ show, handleClickOutside }: GlobalSearchResultProps) => {
  const searchParams = useSearchParams()
  const global = searchParams.get('global')
  const type = searchParams.get('type')
  const ref = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false)
  const result = [{ _id: "1", title: "title", type: "Answer" }, { _id: "2", title: "lalalla", type: "Questions" }, { _id: "3", title: "leiaddafc", type: "Tag" }]

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handleClickOutside && handleClickOutside()
      }
    }
    document.addEventListener("click", onClickOutside)
    return () => {
      document.removeEventListener('click', onClickOutside, true);
    }
  }, [handleClickOutside])

  useEffect(() => {
    // const result = getGlobalSearchResult({ global, type })
  }, [global, type])

  if (!show) return null

  const Item = ({
    id, title, type
  }: {
    id: string, title: string, type: string
  }) => {
    let link = ''
    switch (type) {
      case 'Answer':
        link = `/answer/${id}`
        break
      case 'Question':
        link = `/question/${id}`
        break
      case 'Tag':
        link = `/tag/${id}`
        break
      default:
        link = ''
    }

    return (
      <Link href={link} className='flex w-full items-start justify-start gap-3 px-5 py-2 hover:bg-light-700/50 dark:hover:bg-dark-500/50'>
        <Image src='/assets/icons/tag.svg' alt='link' width={18} height={18} className='invert-colors mt-1 object-contain' />
        <div className='flex flex-col justify-start'>
          <p className='text-dark200_light800 body-medium line-clamp-1'>{title}</p>
          <p className='small-medium text-light400_light500 mt-1 capitalize'>{type}</p>
        </div>
      </Link>
    )
  }

  return (
    <div ref={ref} className='background-light800_dark400 absolute top-full z-10 mt-4 flex max-h-[450px] w-full flex-col gap-5 rounded-lg py-5 shadow-sm'>
      <div className='flex items-center justify-start gap-3 px-5'>
        <p className='body-medium text-dark400_light900'>Type:</p>
        {globalSearchTypes.map((type) => (
          <GlobalSearchType key={type.title} title={type.title} />
        ))}
      </div>
      <div className='h-[1px] bg-light-700/50 dark:bg-dark-500/50'></div>
      {isLoading ? (
        <div className='flex-center flex-col'>
          <ReloadIcon className='my-2 h-10 w-10 animate-spin text-primary-500' />
          <p className='small-regular text-dark200_light800'>Browsing the whole database...</p>
        </div>
      ) : (
        <div className='flex flex-col justify-start gap-2'>
          <p className='paragraph-semibold text-dark400_light900 px-5 pb-3'>Top Match</p>
          {result.length > 0 ? (
            result.map((item) => (
              <Item key={item._id} id={item._id} title={item.title} type={item.type.toUpperCase()} />
            ))
          ) : (
            <div className='flex-center flex-col'>
              <p className='text-[46px]'>👻</p>
              <p className='small-regular text-dark200_light800'>Oops, no results found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default GlobalSearchResult