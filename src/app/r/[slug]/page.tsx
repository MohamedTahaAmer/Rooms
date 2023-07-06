import MiniCreatePost from '@/components/MiniCreatePost'
import PostFeed from '@/components/PostFeed'
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    slug: string
  }
}
// >(2:59) this params are passed to all the pages by default
const page = async ({ params }: PageProps) => {
  const { slug } = params

  // >(3:01) depending on the user login state we will diplay differenet UI
  const session = await getAuthSession()

  // >(3:02) this is all prisma stuf
  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        orderBy: {
          createdAt: 'desc'
        },
        // >(3:03) this take limits how many posts will return, and we don't get all the posts at once, as we wanna make infinite scrolling
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
      },
    },
  })

  // >(3:04) this notFound will display the 404 page of next.js
  if (!subreddit) return notFound()

  return (
    <>
      <h1 className='font-bold text-3xl md:text-4xl h-14'>
        r/{subreddit.name}
      </h1>
      <MiniCreatePost session={session} />
      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
    </>
  )
}

export default page
