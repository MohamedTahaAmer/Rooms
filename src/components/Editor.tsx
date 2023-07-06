'use client'

import EditorJS from '@editorjs/editorjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'
import { z } from 'zod'

import { toast } from '@/hooks/use-toast'
import { uploadFiles } from '@/lib/uploadthing'
import { PostCreationRequest, PostValidator } from '@/lib/validators/post'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

import '@/styles/editor.css'

type FormData = z.infer<typeof PostValidator>

interface EditorProps {
  subredditId: string
}

// >(4:04)
export const Editor: React.FC<EditorProps> = ({ subredditId }) => {
  // - just take a moment to grasp that the next 15 lines of code are just us calling a function and getting it's return
  const {
    register,
    handleSubmit,
    formState: { errors },
    // >(4:09) he is saying that he wanna inforce a type on that form, and he will use sth called resolver to do that
  } = useForm<FormData>({
    // >(4:12) this resover is used to validate the form on the client
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: '',
      content: null,
    },
  })

  const ref = useRef<EditorJS>()
  const _titleRef = useRef<HTMLTextAreaElement>(null) // >(4:40)
  const router = useRouter()
  const [isMounted, setIsMounted] = useState<boolean>(false)// >(4:36)
  const pathname = usePathname()

  // >(4:49)
  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title, // >(4:51) note, use console ninja to see from where does these title, content, subredditId get it's value
      content,
      subredditId,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = { title, content, subredditId }
      const { data } = await axios.post('/api/subreddit/post/create', payload)
      return data
    },
    onError: () => {  // >(4:52)
      return toast({
        title: 'Something went wrong.',
        description: 'Your post was not published. Please try again.',
        variant: 'destructive', 
      })
    },
    onSuccess: () => {
      // turn pathname /r/mycommunity/submit into /r/mycommunity
      const newPathname = pathname.split('/').slice(0, -1).join('/')  // >(4:55)
      router.push(newPathname)

      router.refresh()

      return toast({
        description: 'Your post has been published.',
      })
    },
  })

  // >(4:14) he is talking about next.js streaming content down to the client, not to block his interaction with the page
  // >(4:15) this useCallback is used to maintain the function ref acress rerenders
  const initializeEditor = useCallback(async () => {
    // >(4:14) note that he is importing inside the the component not on the top level of the current file
    const EditorJS = (await import('@editorjs/editorjs')).default
    const Header = (await import('@editorjs/header')).default
    const Embed = (await import('@editorjs/embed')).default
    const Table = (await import('@editorjs/table')).default
    const List = (await import('@editorjs/list')).default
    const Code = (await import('@editorjs/code')).default
    const LinkTool = (await import('@editorjs/link')).default
    const InlineCode = (await import('@editorjs/inline-code')).default
    const ImageTool = (await import('@editorjs/image')).default

    // >(4:17) if there is no editor yet
    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor', // >(4:38)
        onReady() {
          ref.current = editor
        },
        placeholder: 'Type here to write your post...',
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              // >(4:21) this route will be used to get the meta data of certain link when ever the user adds a link in his post
              endpoint: '/api/link',
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                 // >(4:33) upload to uploadthing
                  const [res] = await uploadFiles([file], 'imageUploader')

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  }
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      })
    }
  }, [])

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        value // >(4:46) another stray variable
        toast({
          title: 'Something went wrong.',
          description: (value as { message: string }).message,
          // description: value.message as string,  // >(4:46) what is the difference between this and the above one
          variant: 'destructive',
        })
      }
    }
  }, [errors])

  useEffect(() => {
    // >(4:35) making sure we are in the client side, as in the server the window object will be  undifined
    if (typeof window !== 'undefined') {
      setIsMounted(true)
      // - i think that we could have avoided using two useEffects and isMount state and done our logic in here inside thie if statement direcly
    }
  }, [])

  // >(4:36) this might be the first time we use two useEffects on the same component
  useEffect(() => {
    const init = async () => {
      await initializeEditor()

      setTimeout(() => {
        _titleRef?.current?.focus()
      }, 0) // >(4:43) this timeout of zero is just to execute this callback at the end of the synch call stalk
    }

    if (isMounted) {
      init()

      return () => {
        // >(4:43) cleanUp function
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  async function onSubmit(data: FormData) {
    const blocks = await ref.current?.save()  // >(4:48)

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      subredditId,
    }

    createPost(payload)
  }

  if (!isMounted) {
    return null
  }

  // >(4:41) this register has a ref into it, and we wanna have add our own ref to the TextareaAutosize, so we extract this ref from the register and call it manually and assgin our ref in a callback function passed as a ref to the Textarea
  const { ref: titleRef, ...rest } = register('title')

  return (
    <div className='w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200'>
      <form
        id='subreddit-post-form'
        className='w-fit'
        // >(4:44) he is calling the handleSubmit directly in here, i think it takes a funcion, wraps it inside another function and call the function it takes with the data object, and it return that wrapper function
        onSubmit={handleSubmit(onSubmit)}>
        <div className='prose prose-stone dark:prose-invert'>

          {/* // >(4:05) */}
          <TextareaAutosize
            ref={(e) => {
              titleRef(e)
              // @ts-ignore
              _titleRef.current = e
            }}
            {...rest}
            placeholder='Title'
            className='w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none'
          />
          {/* // >(4:38) */}
          <div id='editor' className='min-h-[500px]' />
          <p className='text-sm text-gray-500'>
            Use{' '}
            <kbd className='rounded-md border bg-muted px-1 text-xs uppercase'>
              Tab
            </kbd>{' '}
            to open the command menu.
          </p>
        </div>
      </form>
    </div>
  )
}
