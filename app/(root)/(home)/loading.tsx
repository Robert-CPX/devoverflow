import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <section className='flex w-full flex-col gap-8'>
      <div className='flex justify-between'>
        <h1 className='h1-bold text-dark100_light900'>All Questions</h1>
        <Skeleton className="background-light900_darkgradient h-[58px] w-[138px] rounded-md" />
      </div>
      <Skeleton className="background-light900_darkgradient h-[58px] w-full rounded-md" />
      <div className='flex gap-3 max-md:hidden'>
        {[1, 2, 3, 4].map((_, i) => (
          <Skeleton key={i} className={`background-light900_darkgradient h-[50px] ${i % 2 === 0 ? 'w-[110px]' : 'w-[120px]'} rounded-md`} />
        ))}
      </div>

      {[1, 2, 3].map((_, i) => (
        <Skeleton key={i} className="background-light900_darkgradient h-[150px] w-full rounded-md" />
      ))}
    </section>
  )
}

export default Loading
