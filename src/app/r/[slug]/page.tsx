import PostFeed from '@/components/PostFeed';
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

interface PageProps {
	params: {
		slug: string;
	};
}

const page = async ({ params }: PageProps) => {
	try {
		const { slug } = params;

		const session = await getAuthSession();

		// console.time('r/Slug');

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
						createdAt: 'desc',
					},
					take: INFINITE_SCROLL_PAGINATION_RESULTS,
				},
			},
		});
		// console.timeEnd('r/Slug');

		if (!subreddit) return notFound();

		return (
			<>
				{subreddit.posts && (
					<PostFeed
						initialPosts={subreddit.posts}
						subredditName={subreddit.name}
					/>
				)}
			</>
		);
	} catch (error: any) {
		console.log(error.message);
	}
};

export default page;
