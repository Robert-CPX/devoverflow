import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <section className='flex w-full flex-col gap-8'>
      <div className='flex justify-between'>
        <h1 className='h1-bold text-dark100_light900'>Saved Questions</h1>
      </div>
      <div className='flex gap-3 max-sm:flex-col'>
        <Skeleton className="background-light900_darkgradient h-[58px] w-full rounded-md" />
        <Skeleton className="background-light900_darkgradient h-[58px] w-[158px] rounded-md" />
      </div>
      {[1, 2, 3].map((_, i) => (
        <Skeleton key={i} className="background-light900_darkgradient h-[150px] w-full rounded-md" />
      ))}
    </section>
  )
}

export default Loading
