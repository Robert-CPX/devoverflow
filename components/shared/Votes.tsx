'use client'

import { Button } from '@/components/ui/button'
import { upvoteQuestion, downvoteQuestion } from '@/lib/actions/question.action'
import { upvoteAnswer, downvoteAnswer } from '@/lib/actions/answer.action'
import { saveQuestion } from '@/lib/actions/user.action'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { viewQuestion } from '@/lib/actions/interaction.action'
import { toast } from '@/components/ui/use-toast';

type VotesProps = {
  type: "Question" | "Answer";
  id: string;
  userId?: string;
  upvoted: boolean;
  downvoted: boolean;
  upvoteNum: number;
  downvoteNum: number;
  saved: boolean;
}

const Votes = ({
  upvoted, downvoted, upvoteNum = 0, downvoteNum = 0, type, id, userId, saved = false
}: VotesProps) => {
  const pathname = usePathname()
  const router = useRouter()

  const handleUpvote = async () => {
    if (!userId) {
      toast({ title: "Please log in", description: "You need to login to continue" })
      return
    }
    const upvoteParam = { userId, hasupVoted: upvoted, hasdownVoted: downvoted, path: pathname }
    if (type === "Question") {
      await upvoteQuestion({ questionId: id, ...upvoteParam })
    } else if (type === "Answer") {
      await upvoteAnswer({ answerId: id, ...upvoteParam })
    }
  }

  const handleDownvote = async () => {
    if (!userId) {
      toast({ title: "Please log in", description: "You need to login to continue" })
      return
    }
    const downvoteParam = { userId, hasupVoted: upvoted, hasdownVoted: downvoted, path: pathname }
    if (type === "Question") {
      await downvoteQuestion({ questionId: id, ...downvoteParam })
    } else if (type === "Answer") {
      await downvoteAnswer({ answerId: id, ...downvoteParam })
    }
  }

  const handleSave = async () => {
    if (!userId) {
      toast({ title: "Please log in", description: "You need to login to continue" })
      return
    }
    await saveQuestion({ questionId: id, userId, path: pathname })
  }

  useEffect(() => {
    viewQuestion({ questionId: id, userId })
  }, [id, userId, pathname, router])

  return (
    <div className='flex-center gap-[10px]'>
      <div className='flex-center gap-[6px]'>
        <Button variant="outline" size="icon" className='h-[18px] w-[18px] border-none' onClick={handleUpvote}>
          <Image src={`/assets/icons/${upvoted ? "upvoted" : "upvote"}.svg`} alt="upvote icon" width={18} height={18} />
        </Button>
        <p className='subtle-medium text-dark400_light900 background-light700_dark400 rounded-sm p-1'>{upvoteNum}</p>
      </div>
      <div className='flex-center gap-[6px]'>
        <Button variant="outline" size="icon" className='h-[18px] w-[18px] border-none' onClick={handleDownvote}>
          <Image src={`/assets/icons/${downvoted ? "downvoted" : "downvote"}.svg`} alt="downvote icon" width={18} height={18} />
        </Button>
        <p className='subtle-medium text-dark400_light900 background-light700_dark400 rounded-sm p-1'>{downvoteNum}</p>
      </div>
      {type === "Question" && (
        <Button variant="outline" size="icon" className='ml-[6px] h-[18px] w-[18px] border-none' onClick={handleSave}>
          <Image src={`/assets/icons/${saved ? "star-filled" : "star-red"}.svg`} alt='star icon' width={18} height={18} />
        </Button>
      )}
    </div>
  )
}

export default Votes
