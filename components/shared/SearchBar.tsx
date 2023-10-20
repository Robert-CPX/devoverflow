'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'

const GlobalSearchBar = () => {
  return (
    <div className='background-light800_darkgradient relative flex min-h-[56px] w-full max-w-[600px] items-center justify-start gap-1 rounded-lg px-4 max-lg:hidden'>
      <Image
        src="/assets/icons/search.svg"
        width={23}
        height={23}
        alt='search'
      />
      <Input
        type='text'
        onChange={() => { }}
        className='text-dark400_light900 no-focus placeholder paragraph-regular border-none bg-transparent outline-none'
        placeholder='Search anything globally...'
      />
    </div>
  )
}

type LocalSearchType = "Question" | "User" | "Tag"

const LocalSearchBar = ({ type }: { type: LocalSearchType }) => {
  const searchParams = useSearchParams()
  const q = searchParams.get('q')
  const [debouncedQuery, setDebouncedQuery] = useState(q || "")
  const router = useRouter()
  const [query, setQuery] = useState(debouncedQuery || "")

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(debouncedQuery)
    }, 1000)
    return () => clearTimeout(timer)
  }, [debouncedQuery])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (query === "") {
      params.delete('q')
    } else {
      params.set('q', encodeURI(query))
    }
    router.push(`?${params}`)
  }, [query, router, searchParams])

  return (
    <div className='background-light800_darkgradient relative flex min-h-[56px] w-full items-center justify-start gap-1 rounded-lg px-4'>
      <Image
        src="/assets/icons/search.svg"
        width={23}
        height={23}
        alt='search'
      />
      <Input
        type='text'
        value={debouncedQuery}
        onChange={(e) => setDebouncedQuery(e.target.value)}
        className='text-dark400_light900 no-focus placeholder paragraph-regular border-none bg-transparent outline-none'
        placeholder={`${type === "Question" ? "Search questions..." : type === "User" ? "Search amazing minds here..." : "Search tag questions..."}`}
      />
    </div>
  )
}

export { GlobalSearchBar, LocalSearchBar }
