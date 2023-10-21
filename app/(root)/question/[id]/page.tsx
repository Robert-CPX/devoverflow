import React from 'react'
import { getQuestionById } from '@/lib/actions/question.action'
import Image from 'next/image'
import { getTimeStamp } from '@/lib/utils'
import Link from 'next/link'
import ParseHTML from '@/components/shared/ParseHTML'
import RenderTag from '@/components/shared/RenderTag'
import { Filter } from '@/components/shared/Filter'
import { AnswerFilters } from '@/constants/filter'
import AnswerForm from '@/components/shared/forms/Answer'
import { auth } from '@clerk/nextjs'
import { getUsereById } from '@/lib/actions/user.action'
import { getAnswers } from '@/lib/actions/answer.action'
import AnswerCard from '@/components/shared/cards/AnswerCard'
import Votes from '@/components/shared/Votes'
import Pagination from '@/components/shared/Pagination'

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

const Page = async ({
  params,
  searchParams
}: {
  params: { id: string },
  searchParams: {
    [key: string]: string | number | undefined
  }
}) => {
  const question = await getQuestionById({ questionId: params.id })
  const page = searchParams.page as number < 1 ? 1 : searchParams.page as number

  const { answers, isNext } = await getAnswers({
    questionId: params.id,
    page,
    sortBy: decodeURI(searchParams.filter as string ?? ""),
  })

  const { userId } = auth()
  if (!userId) return (<p>Not logged in</p>)
  const mongooseUser = await getUsereById({ userId })
  const upvotedQuestion = question.upvotes.some(_id => _id === mongooseUser._id)
  const downvotedQuestion = question.downvotes.some(_id => _id === mongooseUser._id)
  const isSaved = question.saves.some(userId => userId === mongooseUser._id)

  return (
    <article className='flex flex-col justify-start gap-[30px]'>
      <div className='flex flex-col gap-[14px]'>
        <div className='mt-3 flex justify-between'>
          <Link href={`/profile/${question.author.clerkId}`} className='flex-center gap-1'>
            <Image src={question.author.picture} alt="profile" width={22} height={22} className='rounded-full' />
            <p className='paragraph-semibold text-dark300_light700'>{question.author.name}</p>
          </Link>
          <Votes type='Question' upvoted={upvotedQuestion} downvoted={downvotedQuestion} id={question._id} userId={mongooseUser._id} upvoteNum={question.upvotes.length} downvoteNum={question.downvotes.length} saved={isSaved} />
        </div>
        <h2 className='h2-semibold text-dark200_light900 mb-1'>{question.title}</h2>
        <Influence asked={getTimeStamp(question.createdAt)} answers={question.answers.length} views={question.views} votes={0} />
      </div>
      <div className='markdown'>
        <ParseHTML data={question.content} />
      </div>
      <div className='mt-2 flex gap-2'>
        {question.tags.map((tag) => (
          <RenderTag key={tag._id.toString()} _id={tag._id.toString()} name={tag.name} customClassName="uppercase subtle-medium rounded-md px-4 py-2" />
        ))}
      </div>
      <div className='mt-1 flex items-center justify-between'>
        <p className='paragraph-medium primary-text-gradient'>{`${question.answers.length} Answers`}</p>
        <Filter filters={AnswerFilters} />
      </div>
      {answers && answers.map((answer) => (
        <AnswerCard key={answer._id}
          _id={answer._id}
          content={answer.content}
          upvotes={answer.upvotes}
          downvotes={answer.downvotes}
          author={{ clerkId: answer.author.clerkId, _id: answer.author._id.toString(), name: answer.author.name, picture: answer.author.picture }}
          userId={mongooseUser._id}
          createdAt={getTimeStamp(answer.createdAt)}
        />
      ))}
      <div className={answers.length === 0 ? 'hidden' : ''}>
        <Pagination page={page} isNext={isNext} />
      </div>
      <AnswerForm question={question.content} questionId={question._id} userId={mongooseUser._id} />
    </article>
  )
}

export default Page
