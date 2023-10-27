import React from 'react'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link';

type RenderTagProps = {
  _id?: string;
  name: string;
  customClassName?: string;
}

const RenderTag = ({ _id, name, customClassName }: RenderTagProps) => {
  return (
    _id === undefined ? (
      <Badge className={`text-light400_light500 background-light800_dark300 line-clamp-1 flex ${customClassName}`}>{name}</Badge>
    ) : (
      <Link href={`/tags/${_id}`} className='flex'>
        <Badge className={`text-light400_light500 background-light800_dark300 line-clamp-1 flex ${customClassName}`}>{name}</Badge>
      </Link>
    )
  )
}

export default RenderTag