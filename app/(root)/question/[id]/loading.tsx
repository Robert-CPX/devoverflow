import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="flex-center gap-1">
          <Skeleton className="background-light900_darkgradient h-[30px] w-[30px] rounded-full" />
          <Skeleton className="background-light900_darkgradient h-[30px] w-[120px] rounded-sm" />
        </div>
        <Skeleton className="background-light900_darkgradient h-[30px] w-[120px] rounded-sm" />
      </div>
      <Skeleton className="background-light900_darkgradient h-[80px] w-full rounded-md" />
      <Skeleton className="background-light900_darkgradient h-[30px] w-[65%] rounded-md" />
      <Skeleton className="background-light900_darkgradient mt-8 h-[200px] w-full rounded-md" />
      <Skeleton className="background-light900_darkgradient mb-8 h-[30px] w-[100px] rounded-sm" />
      <div className="flex justify-between">
        <Skeleton className="background-light900_darkgradient h-[30px] w-[100px] rounded-sm" />
        <Skeleton className="background-light900_darkgradient h-[30px] w-[100px] rounded-sm" />
      </div>
      <Skeleton className="background-light900_darkgradient h-[30px] w-full rounded-md" />
      <Skeleton className="background-light900_darkgradient mt-8 h-[200px] w-full rounded-md" />
    </section>
  )
}

export default Loading