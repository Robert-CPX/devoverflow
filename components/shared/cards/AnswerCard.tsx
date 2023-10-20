import Link from 'next/link';
import Image from 'next/image';
import ParseHTML from '../ParseHTML';
import Votes from '../Votes';

type AnswerCardProps = {
  _id: string;
  userId: string;
  author: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
  }
  createdAt: string;
  upvotes: string[];
  downvotes: string[];
  content: string;
}

const AnswerCard = ({
  _id,
  userId,
  content,
  upvotes,
  downvotes,
  author,
  createdAt
}: AnswerCardProps) => {
  const upvoted = upvotes.some(_id => _id === userId)
  const downvoted = downvotes.some(_id => _id === userId)
  return (
    <article className='light-border flex flex-col justify-start gap-6 border-b'>
      <div className='mt-3 flex justify-between'>
        <div className='flex-center gap-1 max-sm:flex-col max-sm:items-start'>
          <Link href={`/profile/${author.clerkId}`} className='flex-center gap-1'>
            <Image src={author.picture} alt="profile" width={24} height={24} className='rounded-full' />
            <p className='body-semibold text-dark300_light700'>{author.name}</p>
          </Link>
          <p className='small-regular text-light400_light500'><span className='max-sm:hidden'>·</span>{` answered ${createdAt}`}</p>
        </div>
        <Votes type='Answer' upvoted={upvoted} downvoted={downvoted} id={_id} userId={author._id} upvoteNum={upvotes.length} downvoteNum={downvotes.length} saved />
      </div>
      <div className='markdown mb-10'>
        <ParseHTML data={content} />
      </div>
    </article>
  )
}

export default AnswerCard