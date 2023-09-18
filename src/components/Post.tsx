'use client';

import { formatTimeToNow } from '@/lib/utils';
import { Post, User, Vote } from '@prisma/client';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { FC, useRef } from 'react';
import EditorOutput from './EditorOutput';
import PostVoteClient from './post-vote/PostVoteClient';

interface PostProps {
	post: Post & {
		author: User;
		votes: Vote[];
	};
	votesAmt: number;
	subredditName: string;
	// currentVote?: PartialVote;
	currentVote?: Vote;
	commentAmt: number;
}

const Post: FC<PostProps> = ({
	post,
	votesAmt: _votesAmt,
	currentVote: _currentVote,
	subredditName,
	commentAmt,
}) => {
	const pRef = useRef<HTMLParagraphElement>(null);

	return (
		<div className='rounded-md bg-background shadow shadow-shadow/10 dark:shadow-shadow/30'>
			<div className='flex justify-between px-6 py-4'>
				<PostVoteClient
					postId={post.id}
					initialVotesAmt={_votesAmt}
					initialVote={_currentVote?.type}
				/>

				<div className='w-0 flex-1 '>
					<div className='mt-1 max-h-40 text-xs text-foreground'>
						{subredditName ? (
							<>
								<Link
									className='  text-sm text-foreground underline underline-offset-2'
									href={`/r/${subredditName}`}
								>
									r/{subredditName}
								</Link>
								<span className='px-1'>•</span>
							</>
						) : null}
						<span>Posted by u/{post.author.username}</span>{' '}
						{formatTimeToNow(new Date(post.createdAt))}
					</div>
					<Link href={`/r/${subredditName}/post/${post.id}`}>
						<h1 className='truncate py-2 text-lg font-semibold leading-6 text-foreground'>
							{post.title}
						</h1>
					</Link>

					<div
						className='relative h-[160px] max-h-40 w-full overflow-hidden text-clip text-sm'
						ref={pRef}
					>
						<EditorOutput content={post.content} />
						{pRef.current?.clientHeight && pRef.current.clientHeight >= 160 ? (
							// blur bottom if content is too long
							<Link
								href={`/r/${subredditName}/post/${post.id}`}
								className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-background to-transparent'
							></Link>
						) : null}
					</div>
				</div>
			</div>

			<div className='z-20 bg-background p-4 text-sm sm:px-6'>
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
