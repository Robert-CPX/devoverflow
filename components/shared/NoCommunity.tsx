import React from 'react'
import { Button } from '../ui/button'

const NoCommunity = () => {
  return (
    <section className='flex-center mt-12 flex-col gap-3'>
      <h2 className='h2-bold text-dark200_light900'>There&apos;s no user yet</h2>
      <Button className='paragraph-medium primary-gradient w-[173px] rounded-lg px-4 py-3 text-light-900'>Join a community</Button>
    </section>
  )
}

export default NoCommunity
