'use client'

import Image from 'next/image'

// >(5:46) there are some packages that don't work well with ts
function CustomImageRenderer({ data }: any) {
  const src = data.file.url

  return (
    <div className='relative w-full min-h-[15rem]'>
      <Image alt='image' className='object-contain' fill src={src} />
    </div>
  )
}

export default CustomImageRenderer
