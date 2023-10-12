import React from 'react'
import { getQuestionById } from '@/lib/actions/question.action'
import Image from 'next/image'
import { getTimeStamp } from '@/lib/utils'
import Link from 'next/link'
import ParseHTML from '@/components/shared/ParseHTML'
import RenderTag from '@/components/shared/RenderTag'
import Filter from '@/components/shared/Filter'
import { AnswerFilters } from '@/constants/filter'
import AnswerForm from '@/components/shared/forms/Answer'
import { auth } from '@clerk/nextjs'
import { getUsereById } from '@/lib/actions/user.action'
import { getAnswers } from '@/lib/actions/answer.action'
import AnswerCard from '@/components/shared/cards/AnswerCard'
import Votes from '@/components/shared/Votes'
import { Button } from '@/components/ui/button'

const Influence = ({
  asked, answers, views, votes
}: {
  asked: string, answers: number, views: number, votes: number
}) => (
  <div className='flex justify-start gap-4'>
    <div className='flex gap-1'>
      <Image className='object-contain' src="/assets/icons/clock.svg" alt='clock icon' width={14} height={14} />
      <p className='small-regular text-dark400_light700'>{`Asked ${asked}`}</p>
    </div>
    <div className={`flex gap-1 ${votes === 0 ?? 'hidden'}`}>
      <Image className='object-contain' src="/assets/icons/like.svg" alt='like icon' width={16} height={16} />
      <p className='small-regular text-dark400_light700'>{`${votes} Votes`}</p>
    </div>
    <div className={`flex gap-1 ${answers === 0 ?? 'hidden'}`}>
      <Image className='object-contain' src="/assets/icons/message.svg" alt='message icon' width={16} height={16} />
      <p className='small-regular text-dark400_light700'>{`${answers} Answers`}</p>
    </div>
    <div className={`flex gap-1 ${views === 0 ?? 'hidden'}`}>
      <Image className='object-contain' src="/assets/icons/eye.svg" alt='eye icon' width={16} height={16} />
      <p className='small-regular text-dark400_light700'>{`${views} Views`}</p>
    </div>
  </div>
)

const Page = async ({ params }: { params: { id: string } }) => {
  const question = await getQuestionById({ questionId: params.id })
  const answers = await getAnswers({ questionId: params.id })
  const { userId } = auth()
  if (!userId) return (<p>Not logged in</p>)
  const mongooseUser = await getUsereById({ userId })
  const isCollected = false

  return (
    <article className='flex flex-col justify-start gap-[30px]'>
      <div className='flex flex-col gap-[14px]'>
        <div className='mt-3 flex justify-between'>
          <Link href={`/profile/${question.author.clerkId}`} className='flex-center gap-1'>
            <Image src={question.author.picture} alt="profile" width={22} height={22} className='rounded-full' />
            <p className='paragraph-semibold text-dark300_light700'>{question.author.name}</p>
          </Link>
          <div className='flex gap-1'>
            <Votes upvoted downvoted={false} />
            <Button variant="outline" size="icon" className='ml-[6px] h-[18px] w-[18px] border-none'>
              <Image src={`/assets/icons/${isCollected ? "star-filled" : "star-red"}.svg`} alt='star icon' width={18} height={18} />
            </Button>
          </div>
        </div>
        <h2 className='h2-semibold text-dark200_light900 mb-1'>{question.title}</h2>
        <Influence asked={getTimeStamp(question.createdAt)} answers={question.answers.length} views={question.views} votes={0} />
      </div>
      <ParseHTML data={question.content} />
      <div className='mt-2 flex gap-2'>
        {question.tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} customClassName="uppercase subtle-medium rounded-md px-4 py-2" />
        ))}
      </div>
      <div className='mt-1 flex items-center justify-between'>
        <p className='paragraph-medium primary-text-gradient'>{`${question.answers.length} Answers`}</p>
        <Filter filters={AnswerFilters} />
      </div>
      {answers && answers.map((answer) => (
        <AnswerCard key={JSON.stringify(answer._id)}
          content={answer.content}
          upvotes={answer.upvotes.length}
          downvotes={answer.downvotes.length}
          author={{ clerkId: answer.author.clerkId, _id: answer.author._id, name: answer.author.name, picture: answer.author.picture }}
          createdAt={answer.createdAt}
        />
      ))}
      <AnswerForm question={question.content} questionId={JSON.stringify(question._id)} userId={JSON.stringify(mongooseUser._id)} />
    </article>
  )
}

export default Page
