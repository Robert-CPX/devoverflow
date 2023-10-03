import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type FilterProps = {
  filters: {
    name: string;
    value: string;
  }[];
  customClassName?: string;
}

const Filter = ({filters, customClassName}: FilterProps) => {
  return (
    <Select>
      <SelectTrigger className="background-light800_darkgradient text-dark500_light700 light-border h-full min-h-[56px] w-[180px] max-sm:w-full">
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

export default Filter
