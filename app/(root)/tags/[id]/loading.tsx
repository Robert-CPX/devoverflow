import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <section className='flex w-full flex-col gap-8'>
      <div className='flex justify-between'>
        <Skeleton className="background-light900_darkgradient h-[58px] w-[140px] rounded-md" />
      </div>
      <Skeleton className="background-light900_darkgradient h-[58px] w-full rounded-md" />
      {[1, 2, 3, 4].map((_, i) => (
        <Skeleton key={i} className="background-light900_darkgradient h-[150px] w-full rounded-md" />
      ))}
    </section>
  )
}

export default Loading
