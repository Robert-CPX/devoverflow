import React from 'react'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link';

type RenderTagProps = {
  _id: number;
  name: string;
  customClassName?: string;
}

const RenderTag = ({_id, name, customClassName}: RenderTagProps) => {
  return (
    <Link href={`/tags/${_id}`} className='flex'>
      <Badge className={`text-light400_light500 background-light800_dark300 flex ${customClassName}`}>{name}</Badge>
    </Link>
  )
}

export default RenderTag