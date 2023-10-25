import Image from 'next/image'
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <Skeleton className="flex h-screen w-screen items-center justify-center">
      <Image src="/assets/images/auth-light.png" objectFit='contain' alt="loading" width={500} height={500} />
    </Skeleton>
  )
}