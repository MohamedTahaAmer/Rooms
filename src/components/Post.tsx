'use client';

import { formatTimeToNow } from '@/lib/utils';
import type { VoteType } from '@prisma/client';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { FC, useRef } from 'react';
import EditorOutput from './EditorOutput';
import PostVoteClient from './post-vote/PostVoteClient';
import { ExtendedPost } from '@/types/db';

interface PostProps {
  post: ExtendedPost;
  votesAmt: number;
  subredditName: string;
  currentVoteType?: VoteType;
  commentAmt: number;
}

const Post: FC<PostProps> = ({
  post,
  votesAmt,
  currentVoteType,
  subredditName,
  commentAmt,
}) => {
  const pRef = useRef<HTMLParagraphElement>(null);
  const contentHeight = pRef.current?.clientHeight!;

  return (
    <div className=' rounded-md bg-white shadow'>
      <div className='relative z-0 flex justify-between  py-4 pl-3 pr-1'>
        <PostVoteClient
          postId={post.id}
          initialVotesAmt={votesAmt}
          initialVote={currentVoteType}
          classNames='absolute -bottom-[50px] right-1 z-20 p-2 md:static md:order-first md:w-20 md:p-0'
        />

        <div className='w-0 flex-1 pr-2'>
          <div className='mt-1 max-h-40 text-xs text-gray-500'>
            {subredditName && (
              <>
                <a
                  // note that we are using an a tag not next.js Link, as we wanna force the browser to make a request to the server to get the post page and to provide a cached version of the page, and that's to make sure we get the new comments on the post, from other users
                  className='rounded-sm px-1 py-1 shadow'
                  href={`/r/${subredditName}`}
                >
                  r/{subredditName}
                </a>
                <span className='px-1'>•</span>
              </>
            )}
            <span>Posted by u/{post.author.username}</span>
            <span className='px-1'>•</span>
            <Link
              className='rounded-sm px-1 py-1 shadow'
              href={`/r/${subredditName}/post/${post.id}`}
            >
              {formatTimeToNow(new Date(post.createdAt))}
            </Link>
          </div>

          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className='truncate py-2 text-lg font-semibold leading-6  text-gray-900 '>
              {post.title}
            </h1>
          </a>

          <div
            className='relative max-h-40 w-full overflow-clip  text-sm'
            ref={pRef}
          >
            <EditorOutput content={post.content} />

            {contentHeight === 160 && (
              <Link href={`/r/${subredditName}/post/${post.id}`}>
                <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-gray-100 to-transparent'></div>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className='z-10 bg-gray-100 px-4 py-4 text-sm shadow sm:px-6'>
        <Link
          href={`/r/${subredditName}/post/${post.id}`}
          className='flex w-fit items-center gap-2'
        >
          <MessageSquare className='h-4 w-4' /> {commentAmt} comments
        </Link>
      </div>
    </div>
  );
};
export default Post;
