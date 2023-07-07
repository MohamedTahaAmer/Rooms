'use client'  // >(7:34) editorjs-react-renderer depends on the DOM so it must be in a client component

import CustomCodeRenderer from '@/components/renderers/CustomCodeRenderer'
import CustomImageRenderer from '@/components/renderers/CustomImageRenderer'
import { FC } from 'react'
import dynamic from 'next/dynamic'

// >(5:42) in next.js you can import components dynamically
const Output = dynamic(
  async () => (await import('editorjs-react-renderer')).default,
  { ssr: false }  // >(5:43) this component throws error if rendered at the server
)

interface EditorOutputProps {
  content: any
}

// >(5:43)
const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
}

// >(5:45)
const style = {
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
}

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    // >(5:45) strange how the error ommit comment itself is giving us an error
    // -diff
    // // @ts-expect-error 
    <Output
      style={style}
      className='text-sm'
      renderers={renderers}
      data={content}
    />
  )
}

export default EditorOutput
