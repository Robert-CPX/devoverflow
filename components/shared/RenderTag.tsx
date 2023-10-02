import React from 'react'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link';

type RenderTagProps = {
  _id: number;
  name: string;
}

const RenderTag = ({_id, name}: RenderTagProps) => {
  return (
    <Link href={`/tags/${_id}`} className='flex'>
      <Badge className='text-light400_light500 subtle-medium background-light800_dark300 flex rounded-md px-4 py-2 uppercase'>{name}</Badge>
    </Link>
  )
}

export default RenderTag
