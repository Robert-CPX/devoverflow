import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <section className='flex flex-col gap-8'>
      <h1 className='h1-bold text-dark100_light900'>All Tags</h1>
      <div className='flex gap-3 max-sm:flex-col'>
        <Skeleton className="background-light900_darkgradient h-[58px] w-full rounded-md" />
        <Skeleton className="background-light900_darkgradient h-[58px] w-[138px] rounded-md" />
      </div>
      <div className='flex w-full flex-wrap justify-start gap-5'>
        {[1, 2, 3, 4].map((_, i) => (
          <Skeleton key={i} className="background-light900_darkgradient h-[280px] w-[260px] rounded-md" />
        ))}
      </div>
    </section >
  )
}

export default Loading
