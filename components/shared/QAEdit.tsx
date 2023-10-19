'use client'
import { Button } from '@/components/ui/button'
import { deleteQuestion } from '@/lib/actions/question.action';
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation';

type QAEditProps = {
  type: 'top_post' | 'answers';
  itemId: string;
}

const QAEdit = ({ itemId, type }: QAEditProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const handleEdit = () => {
    router.push(`/question/edit/${itemId}`)
  }
  const handleDelete = () => {
    deleteQuestion({ questionId: itemId, path: pathname })
  }
  return (
    <div className='flex gap-1'>
      <Button size="icon" onClick={handleEdit} className={`h-[20px] w-[20px] ${type === 'answers' ? 'hidden' : ''}`}>
        <Image src="/assets/icons/edit.svg" alt='edit' width={14} height={14} />
      </Button>
      <Button size="icon" onClick={handleDelete} className='h-[20px] w-[20px]'>
        <Image src="/assets/icons/trash.svg" alt='trash' width={14} height={14} />
      </Button>
    </div>
  )
}

export default QAEdit
