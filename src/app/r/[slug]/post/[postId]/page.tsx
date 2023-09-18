import CommentsSection from '@/components/CommentsSection';
import EditorOutput from '@/components/EditorOutput';
import PostVoteServer from '@/components/post-vote/PostVoteServer';
import { buttonVariants } from '@/components/ui/Button';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';
import { formatTimeToNow } from '@/lib/utils';
import { CachedPost } from '@/types/redis';
import { Post, User, Vote } from '@prisma/client';
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface SubRedditPostPageProps {
	params: {
		postId: string;
	};
}

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const SubRedditPostPage = async ({ params }: SubRedditPostPageProps) => {
	const cachedPost = (await redis.hgetall(
		`post:${params.postId}`,
	)) as CachedPost;

	let post: (Post & { votes: Vote[]; author: User }) | null = null;

	if (!cachedPost) {
		post = await db.post.findFirst({
			where: {
				id: params.postId,
			},
			include: {
				votes: true,
				author: true,
			},
		});
	}

	if (!post && !cachedPost) return notFound();

	const wideVotes = (
		<Suspense fallback={<PostVoteShell />}>
			{/* @ts-expect-error server component */}
			<PostVoteServer
				postId={post?.id ?? cachedPost.id}
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

	const phoneVotes = (
		<Suspense fallback={<PostVoteShell />}>
			{/* @ts-expect-error server component */}
			<PostVoteServer
				postId={post?.id ?? cachedPost.id}
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

	return (
		<div>
			<div className='flex h-full flex-col items-center justify-between sm:flex-row sm:items-start'>
				<div className='hidden sm:block'>{wideVotes}</div>

				<div className='w-full flex-1 rounded-sm bg-background sm:w-0 sm:p-4 sm:pt-0'>
					<div className='rounded p-2 pb-6 pl-4  shadow shadow-shadow/10 dark:shadow-shadow/30'>
						<p className='mt-1  max-h-40 truncate text-xs text-foreground'>
							Posted by u/{post?.author.username ?? cachedPost.authorUsername}{' '}
							{formatTimeToNow(
								new Date(post?.createdAt ?? cachedPost.createdAt),
							)}
						</p>
						<h1 className='truncate py-2 text-xl font-semibold leading-6 text-foreground'>
							{post?.title ?? cachedPost.title}
						</h1>
						<EditorOutput content={post?.content ?? cachedPost.content} />
					</div>
					<div className='py-2'></div>
					<div className='flex w-full items-center justify-center overflow-hidden  shadow shadow-shadow/10 dark:shadow-shadow/30 sm:hidden'>
						{phoneVotes}
					</div>
					<Suspense
						fallback={
							<Loader2 className='h-5 w-5 animate-spin text-foreground' />
						}
					>
						{/* @ts-expect-error Server Component */}
						<CommentsSection postId={post?.id ?? cachedPost.id} />
					</Suspense>
				</div>
			</div>
		</div>
	);
};

function PostVoteShell() {
	return (
		<div className='flex w-20 flex-col items-center pr-6'>
			{/* upvote */}
			<div className={buttonVariants({ variant: 'ghost' })}>
				<ArrowBigUp className='h-5 w-5 text-foreground' />
			</div>

			{/* score */}
			<div className='py-2 text-center text-sm font-medium text-foreground'>
				<Loader2 className='h-3 w-3 animate-spin' />
			</div>

			{/* downvote */}
			<div className={buttonVariants({ variant: 'ghost' })}>
				<ArrowBigDown className='h-5 w-5 text-foreground' />
			</div>
		</div>
	);
}

export default SubRedditPostPage;
