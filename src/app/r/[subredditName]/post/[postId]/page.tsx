import CommentsSection from '@/components/CommentsSection';
import EditorOutput from '@/components/EditorOutput';
import PostVoteServer from '@/components/post-vote/PostVoteServer';
import { buttonVariants } from '@/components/ui/Button';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';
import { formatTimeToNow } from '@/lib/utils';
import { CachedPost } from '@/types/redis';
import type { Post, User, Vote, VoteType } from '@prisma/client';
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { getAuthSession } from '@/lib/auth';

interface SubRedditPostPageProps {
  params: {
    postId: string;
    subredditName: string;
  };
}

// use those on pages in which you have data that a user can change and you wanna probagate the changes for all the users
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// >(7:05)
const SubRedditPostPage = async ({ params }: SubRedditPostPageProps) => {
  const session = await getAuthSession();

  // >(7:08) getting the cash from redis as it's faster than planetScale
  // const cachedPost = undefined as unknown as CachedPost;

  // hash get all
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`
  )) as CachedPost;

  // >(7:10)
  let post: (Post & { votes: Vote[]; author: User }) | null = null;
  let votesAmt: number = 0;
  let currentVote: VoteType | null | undefined = undefined;

  if (!cachedPost) {
    post = await db.post.findUnique({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });

    if (!post) return notFound();

    votesAmt = post?.votes.reduce((acc, vote) => {
      if (vote.type === 'UP') return acc + 1;
      if (vote.type === 'DOWN') return acc - 1;
      return acc;
    }, 0);

    currentVote = post?.votes.find(
      (vote) => vote.userId === session?.user?.id
    )?.type;
  }

  const postVotesWithCash = cachedPost && (
    <Suspense fallback={<PostVoteShell />}>
      {/* @ts-expect-error server component */}
      <PostVoteServer
        postId={cachedPost.id}
        // here he can't just send the post votes amount and type, as he might get the post from the upstash cache, and in there, the posts has no votes or author associated with them like we can do with prisma
        // note that currently the votyType is stored with the cache, we can also store the votes amount unless of making a fetch request just to get the postAmount and Type
        getData={async () => {
          return await db.post.findUnique({
            where: {
              id: params.postId,
            },
            include: {
              votes: true,
            },
          });
        }}
      />
    </Suspense>
  );

  const postVotesWithPost = post && (
    <Suspense fallback={<PostVoteShell />}>
      {/* @ts-expect-error server component */}
      <PostVoteServer
        initialVotesAmt={votesAmt}
        initialVote={currentVote}
        postId={post!.id}
      />
    </Suspense>
  );

  const postVotes = post ? postVotesWithPost : postVotesWithCash;

  return (
    <div className='order-first flex h-full w-full flex-col items-center justify-between md:col-span-2 md:flex-row md:items-start'>
      {/* // >(7:22) */}
      <div
        // note that this postVotes is rendered twice, one here, for md: and above, and, it's also rendered down after the post for devices smaller than md:
        className='hidden md:mr-2 md:block'
      >
        {postVotes}
      </div>

      {/* // >(7:30) */}
      <div className='w-full flex-1 truncate rounded-sm bg-white p-4 md:w-0 '>
        <div
          // >(7:31) similar to || this ?? returns the first true
          className='mt-1 text-xs text-gray-500'
        >
          Posted by u/{post?.author.username ?? cachedPost.authorUsername}
          <span className='px-1'>•</span>
          <Link
            className='rounded-sm px-1 py-1 shadow'
            href={`/r/${params.subredditName}/post/${params.postId}`}
          >
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </Link>
        </div>
        <h1 className='truncate py-2 text-xl font-semibold leading-6 text-gray-900'>
          {post?.title ?? cachedPost.title}
        </h1>

        <EditorOutput content={post?.content ?? cachedPost.content} />
        <hr className='my-6 h-px w-full md:hidden' />
        <div className='md:hidden'>{postVotes}</div>

        <Suspense
          // >(7:37) this is a simple way of using react Suspense, just provide a component to the fallback property then treat it as a normal div for the main content
          fallback={<Loader2 className='h-5 w-5 animate-spin text-zinc-500' />}
        >
          {/* @ts-expect-error Server Component */}
          <CommentsSection postId={post?.id ?? cachedPost.id} />
        </Suspense>
      </div>
    </div>
  );
};

// >(7:24)
function PostVoteShell() {
  return (
    <div className='flex w-20 flex-col items-center pr-6'>
      {/* upvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigUp className='h-5 w-5 text-zinc-700' />
      </div>

      {/* score */}
      <div className='py-2 text-center text-sm font-medium text-zinc-900'>
        <Loader2 className='h-3 w-3 animate-spin' />
      </div>

      {/* downvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigDown className='h-5 w-5 text-zinc-700' />
      </div>
    </div>
  );
}

export default SubRedditPostPage;
