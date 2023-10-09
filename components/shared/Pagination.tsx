'use client'

import { useState } from 'react'
import { Button } from '../ui/button'

const Pagination = ({ page }: { page: string }) => {
  const [currentPage, setCurrentPage] = useState(1)

  const handlePrev = () => {
    setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    setCurrentPage(currentPage + 1)
  }

  return (
    <div className='flex w-full items-center justify-center gap-2'>
      <Button onClick={handlePrev}>
        Prev
      </Button>
      <div className='flex-center rounded-md bg-primary-500 px-3.5 py-2'>
        <p className='body-semibold text-light-900'>{page}</p>
      </div>
      <Button onClick={handleNext}>
        Next
      </Button>
    </div>
  )
}

export default Pagination
