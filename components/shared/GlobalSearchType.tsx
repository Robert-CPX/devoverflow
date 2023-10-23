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
    setIsActive(type !== newType)
    if (type === newType) {
      params.delete('type')
    } else {
      params.set('type', encodeURI(newType))
    }
    router.push(`?${params}`)
  }

  return (
    <Button className={`text-dark200_light900 flex-center background-light700_dark300 h-[30px] rounded-full ${isActive ? 'bg-primary-500 text-white' : "hover:text-primary-500"}`} onClick={(e) => handleClick(title)}>
      <p className={'small-regular p-1'}>{title}</p>
    </Button>
  )
}

export default GlobalSearchType