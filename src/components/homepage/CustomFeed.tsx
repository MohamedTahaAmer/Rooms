import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config';
import { db } from '@/lib/db';
import PostFeed from '../PostFeed';
import type { Session } from 'next-auth';
import GeneralFeed from './GeneralFeed';

const CustomFeed = async ({ session }: { session: Session }) => {
	try {
		// console.time('customPost');
		const followedCommunities = await db.subscription.findMany({
			where: {
				userId: session.user.id,
			},
			include: {
				subreddit: true,
			},
		});

		if (!followedCommunities) {
			// @ts-expect-error
			return <GeneralFeed />;
		}

		const posts = await db.post.findMany({
			where: {
				subreddit: {
					name: {
						in: followedCommunities.map((sub) => sub.subreddit.name),
					},
				},
			},
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
		// console.timeEnd('customPost');
		return <PostFeed initialPosts={posts} />;
	} catch (error: any) {
		console.log(error.message);
	}
};

export default CustomFeed;
