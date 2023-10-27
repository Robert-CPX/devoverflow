'use client'

import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from 'next/navigation';
import { HomePageFilters } from '@/constants/filter';
import { Button } from '../ui/button';

type FilterProps = {
  filters: {
    name: string;
    value: string;
  }[];
  customClassName?: string;
}

const Filter = ({ filters, customClassName }: FilterProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const handleFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('filter', encodeURI(value))
    router.push(`?${params}`)
  }

  return (
    <Select onValueChange={handleFilter}>
      <SelectTrigger className={`background-light800_darkgradient text-dark500_light700 light-border h-full min-h-[56px] w-[200px] max-sm:w-full ${customClassName}`}>
        <SelectValue placeholder="Select a Filter" />
      </SelectTrigger>
      <SelectContent className='background-light900_dark200 text-dark400_light900 light-border'>
        <SelectGroup>
          {filters.map((filter) => (
            <SelectItem className='hover:background-light800_dark300' key={filter.value} value={`${filter.value}`}>{filter.name}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

const HomeFilter = () => {
  const [active, setActive] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilter = (e: React.MouseEvent<HTMLButtonElement>, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === params.get('filter')) {
      params.delete('filter')
      setActive("")
    } else {
      params.set('filter', encodeURI(value))
      setActive(value)
    }
    router.push(`?${params}`)
  }

  useEffect(() => {
    setActive(searchParams.get('filter') ?? "")
  }, [searchParams])

  return (
    <div className='flex gap-3 max-md:hidden'>
      {HomePageFilters.map((filter) => (
        <Button onClick={(e) => handleFilter(e, filter.value)} key={filter.value} className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none dark:bg-dark-300 ${active === filter.value ? " bg-primary-100 text-primary-500" : "bg-light-800 text-light-500"}`}>
          {filter.name}
        </Button>
      ))}
    </div>
  )
}

export {
  Filter,
  HomeFilter
} 
