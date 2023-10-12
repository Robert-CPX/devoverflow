import Link from 'next/link';
import Image from 'next/image';
import ParseHTML from '../ParseHTML';
import Votes from '../Votes';

type AnswerCardProps = {
  author: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
  }
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  content: string;
}

const AnswerCard = ({
  content,
  upvotes,
  downvotes,
  author,
  createdAt
}: AnswerCardProps) => {
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
        <Votes upvoted downvoted={false} />
      </div>
      <div className='mb-10'>
        <ParseHTML data={content} />
      </div>
    </article>
  )
}

export default AnswerCard