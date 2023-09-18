'use client';

import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config';
import { ExtendedPost } from '@/types/db';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { FC, useEffect, useRef } from 'react';
import Post from './Post';
import { useSession } from 'next-auth/react';

interface PostFeedProps {
	initialPosts: ExtendedPost[];
	subredditName?: string;
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, subredditName }) => {
	const lastPostRef = useRef<HTMLElement>(null);
	const { ref, entry } = useIntersection({
		root: lastPostRef.current,
		threshold: 1,
	});
	const { data: session } = useSession();

	const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
		[subredditName || 'HomePage'],
		async ({ pageParam = 1 }) => {
			const query =
				`/api/posts?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` +
				(!!subredditName ? `&subredditName=${subredditName}` : '');

			const { data } = await axios.get(query);
			return data as ExtendedPost[];
		},

		{
			getNextPageParam: (_, pages) => {
				return pages.length + 1;
			},
			initialData: { pages: [initialPosts], pageParams: [1] },
		},
	);

	const inifinitePosts = data?.pages.flatMap((page) => page)!;
	const posts = inifinitePosts.length ? inifinitePosts : initialPosts;
	console.log(posts.length);
	console.log(inifinitePosts.length);
	console.log(initialPosts.length);
	// never path object or arrays as a dependancy to the useEffect(), only path premetive values
	const dataLength = data?.pages.slice(-1)[0].length;

	useEffect(() => {
		if (entry?.isIntersecting && dataLength && dataLength > 0) {
			fetchNextPage();
		}
	}, [entry, fetchNextPage, dataLength]);

	return (
		<ul className='col-span-2 flex flex-col space-y-6'>
			{posts.length > 0 &&
				posts.map((post, index) => {
					const votesAmt = post.votes.reduce((acc, vote) => {
						if (vote.type === 'UP') return acc + 1;
						if (vote.type === 'DOWN') return acc - 1;
						return acc;
					}, 0);

					const currentVote = post.votes.find(
						(vote) => vote.userId === session?.user.id,
					);

					if (index === posts.length - 1) {
						// Add a ref to the last post in the list
						return (
							<li key={post.id} ref={ref}>
								<Post
									post={post}
									commentAmt={post.comments.length}
									subredditName={post.subreddit.name}
									votesAmt={votesAmt}
									currentVote={currentVote}
								/>
							</li>
						);
					} else {
						return (
							<Post
								key={post.id}
								post={post}
								commentAmt={post.comments.length}
								subredditName={post.subreddit.name}
								votesAmt={votesAmt}
								currentVote={currentVote}
							/>
						);
					}
				})}

			{isFetchingNextPage && (
				<li className='flex justify-center'>
					<Loader2 className='h-6 w-6 animate-spin text-foreground' />
				</li>
			)}
		</ul>
	);
};

export default PostFeed;
