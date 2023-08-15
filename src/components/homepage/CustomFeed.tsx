import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import PostFeed from '../PostFeed';
import { notFound } from 'next/navigation';

// >(7:02)
const CustomFeed = async () => {
  const session = await getAuthSession();

  // only rendered if session exists, so this will not happen
  if (!session) return notFound();

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      subreddit: true,
    },
  });

  let whereClause = {};
  // if he is hasn't followed any subreddites, then he will get all the posts like any un auth one

  if (followedCommunities.length !== 0) {
    // if in home and session and followedCommunitiesIds then get his comunities only
    whereClause = {
      subreddit: {
        name: {
          in: followedCommunities.map((sub) => sub.subreddit.name),
        },
      },
    };
  }

  const posts = await db.post.findMany({
    where: whereClause,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  return <PostFeed userId={session.user.id} initialPosts={posts} />;
};

export default CustomFeed;
