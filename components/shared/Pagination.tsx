'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

type PaginationProps = {
  page: number
  isNext: boolean
}

const Pagination = ({ page = 1, isNext }: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(page)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePagination = (to: string) => {
    let page = currentPage
    if (to === 'prev') {
      page -= 1
    } else {
      page += 1
    }
    setCurrentPage(page)
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', `${page}`)
    router.push(`?${params}`)
  }

  return (
    <div className='flex w-full items-center justify-center gap-2'>
      <Button onClick={() => handlePagination('prev')} disabled={currentPage === 1} className='shadow-light100_darknone light-border text-dark200_light900 background-light900_dark200 disabled:text-dark400_light700 border'>
        Prev
      </Button>
      <div className='flex-center rounded-md bg-primary-500 px-3.5 py-2'>
        <p className='body-semibold text-light-900'>{currentPage}</p>
      </div>
      <Button onClick={() => handlePagination('next')} disabled={!isNext} className='shadow-light100_darknone light-border text-dark200_light900 background-light900_dark200 disabled:text-dark400_light700 border'>
        Next
      </Button>
    </div>
  )
}

export default Pagination
