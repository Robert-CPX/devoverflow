'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

type PaginationProps = {
  count: number
}
const Pagination = ({ count }: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()
  const searchParams = useSearchParams()
  const handlePrev = () => {
    setCurrentPage(currentPage - 1)
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', `${currentPage - 1}`)
    router.push(`?${params}`)
  }

  const handleNext = () => {
    setCurrentPage(currentPage + 1)
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', `${currentPage + 1}`)
    router.push(`?${params}`)
  }

  return (
    <div className={`flex w-full items-center justify-center gap-2 ${count === 0 ?? 'hidden'}`}>
      <Button onClick={handlePrev} disabled={currentPage === 1} className='shadow-light100_darknone light-border text-dark200_light900 background-light900_dark200 disabled:text-dark400_light700 border'>
        Prev
      </Button>
      <div className='flex-center rounded-md bg-primary-500 px-3.5 py-2'>
        <p className='body-semibold text-light-900'>{currentPage}</p>
      </div>
      <Button onClick={handleNext} disabled={count < 10} className='shadow-light100_darknone light-border text-dark200_light900 background-light900_dark200 disabled:text-dark400_light700 border'>
        Next
      </Button>
    </div>
  )
}

export default Pagination
