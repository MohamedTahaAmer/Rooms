import { db } from '@/lib/db'
import PostFeed from '../PostFeed'
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'

// >(6:59)
const GeneralFeed = async () => {
  const posts = await db.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS, // 2 to demonstrate infinite scroll, should be higher in production
  })

  // >(6:59) that's strange, returning a self closing fragmant
  return <PostFeed initialPosts={posts} />
  // return <>PostFeed initialPosts={posts} </>
}

export default GeneralFeed
