import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <section className='flex flex-col items-start gap-5'>
      <div className='relative flex w-full'>
        <article className="flex flex-col gap-4 lg:flex-row">
          <Skeleton className="background-light900_darkgradient h-[140px] w-[140px] rounded-full" />
          <div className='flex flex-col justify-start gap-3'>
            <div className='flex flex-col gap-2'>
              <Skeleton className="background-light900_darkgradient h-[48px] w-[180px] rounded-sm" />
              <Skeleton className="background-light900_darkgradient h-[28px] w-[100px] rounded-sm" />
            </div>
            <div className='mt-2 flex items-center justify-start gap-5'>
              {[1, 2, 3].map((_, i) => (
                <Skeleton key={i} className="background-light900_darkgradient h-[38px] w-[100px] rounded-sm" />
              ))}
            </div>
            <Skeleton className="background-light900_darkgradient h-[58px] w-full rounded-sm" />
          </div>
        </article>
        <div className='absolute right-0 top-0'>
          <Skeleton className="background-light900_darkgradient h-[48px] w-[120px] rounded-sm" />
        </div>
      </div>
      <Skeleton className="background-light900_darkgradient h-[58px] w-[100px] rounded-sm" />
      <div className='grid w-full grid-cols-4 justify-start justify-items-stretch gap-5 max-md:grid-cols-2'>
        {[1, 2, 3, 4].map((_, i) => (
          <Skeleton key={i} className="background-light900_darkgradient h-[150px] w-[150px] rounded-md" />
        ))}
      </div>
      <div className='mt-3 flex w-full gap-10'>
        <div className="flex w-[50%] flex-col gap-3">
          <Skeleton className="background-light900_darkgradient h-[38px] w-[100px] rounded-md" />
          {[1, 2, 3].map((_, i) => (
            <Skeleton key={i} className="background-light900_darkgradient mt-3 h-[100px] w-full rounded-md" />
          ))}
        </div>
        <div className="flex w-[50%] flex-col gap-3">
          <Skeleton className="background-light900_darkgradient h-[38px] w-[100px] rounded-md" />
          {[1, 2, 3, 4, 5].map((_, i) => (
            <Skeleton key={i} className="background-light900_darkgradient mt-3 h-[38px] w-full rounded-md" />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Loading
