'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '../ui/button'

const GlobalSearchType = ({ title }: { title: string }) => {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    setIsActive(type === title)
  }, [type, title])

  const handleClick = (newType: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (type === newType) {
      params.delete('type')
    } else {
      params.set('type', encodeURI(newType))
    }
    setIsActive(type !== newType)
    router.push(`?${params}`)
  }

  return (
    <Button className={`text-dark400_light800 light-border-2 flex-center h-[30px] rounded-2xl bg-light-700 px-5 py-2 capitalize dark:bg-dark-500 ${isActive ? 'bg-primary-500 text-white dark:bg-primary-500' : "hover:text-primary-500"}`} onClick={(e) => handleClick(title)}>
      <p className={'small-medium capitalize'}>{title}</p>
    </Button>
  )
}

export default GlobalSearchType