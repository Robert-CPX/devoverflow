'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'

const Votes = ({
  upvoted, downvoted
}: {
  upvoted: boolean, downvoted: boolean
}) => (
  <div className='flex-center gap-[10px]'>
    <div className='flex-center gap-[6px]'>
      <Button variant="outline" size="icon" className='h-[18px] w-[18px] border-none'>
        <Image src={`/assets/icons/${upvoted ? "upvoted" : "upvote"}.svg`} alt="upvote icon" width={18} height={18} />
      </Button>
      <p className='subtle-medium text-dark400_light900 background-light700_dark400 rounded-sm p-1'>12</p>
    </div>
    <div className='flex-center gap-[6px]'>
      <Button variant="outline" size="icon" className='h-[18px] w-[18px] border-none'>
        <Image src={`/assets/icons/${downvoted ? "downvoted" : "downvote"}.svg`} alt="downvote icon" width={18} height={18} />
      </Button>
      <p className='subtle-medium text-dark400_light900 background-light700_dark400 rounded-sm p-1'>12</p>
    </div>
  </div>
)

export default Votes
