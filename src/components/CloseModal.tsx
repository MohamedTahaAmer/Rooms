'use client'

import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { Button } from './ui/Button'

interface CloseModalProps {}

// >(1:46) although here we arn't expecting any kind of props, but we are still defining the generic type of the props 
const CloseModal: FC<CloseModalProps> = ({}) => {
  const router = useRouter()

  return (
    <Button variant='subtle' className='h-6 w-6 p-0 rounded-md' onClick={() => router.back()}>
      {/* // >(1:47) this aria-label is for accessablitiy perposes */}
      <X aria-label='close modal' className='h-4 w-4' />
    </Button>
  )
}

export default CloseModal
