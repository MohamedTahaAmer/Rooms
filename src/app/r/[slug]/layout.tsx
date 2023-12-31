import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle';
import ToFeedButton from '@/components/ToFeedButton';
import { buttonVariants } from '@/components/ui/Button';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import { ClipboardEdit } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

export const metadata: Metadata = {
	title: 'Rooms',
	description: 'A Reddit clone built with Next.js and TypeScript.',
};

const Layout = async ({
	children,
	params: { slug },
}: {
	children: ReactNode;
	params: { slug: string };
}) => {
	const session = await getAuthSession();

	const subreddit = await db.subreddit.findFirst({
		where: { name: { equals: slug, mode: 'insensitive' } },
		include: {
			posts: {
				include: {
					author: true,
					votes: true,
				},
			},
		},
	});

	const subscription = !session?.user
		? undefined
		: await db.subscription.findFirst({
				where: {
					subreddit: {
						name: slug,
					},
					user: {
						id: session.user.id,
					},
				},
		  });

	const isSubscribed = !!subscription;

	if (!subreddit) return notFound();

	const memberCount = await db.subscription.count({
		where: {
			subreddit: {
				name: slug,
			},
		},
	});

	return (
		<div className='mx-auto h-full max-w-7xl sm:container'>
			<div>
				<ToFeedButton />

				<div className='grid grid-cols-1 gap-y-4 py-6 lg:grid-cols-3 lg:gap-x-4'>
					<div className='relative col-span-2 flex flex-col space-y-6'>
						{children}
					</div>

					{/* info sidebar */}
					<div className='shadoww order-first h-fit overflow-hidden rounded-lg lg:order-last'>
						<div className='bg-violet-200 px-6 py-4 dark:bg-violet-400'>
							<p className='font-semibold dark:text-background'>
								About r/{subreddit.name}
							</p>
						</div>
						<dl className='divide-y divide-background bg-background px-6 py-4 text-sm leading-6'>
							<div className='flex justify-between gap-x-4 py-3'>
								<dt className='text-foreground'>Created</dt>
								<dd className='text-foreground'>
									<time dateTime={subreddit.createdAt.toDateString()}>
										{format(subreddit.createdAt, 'MMMM d, yyyy')}
									</time>
								</dd>
							</div>
							<div className='flex justify-between gap-x-4 py-3'>
								<dt className='text-foreground'>Members</dt>
								<dd className='flex items-start gap-x-2'>
									<div className='text-foreground'>{memberCount}</div>
								</dd>
							</div>
							{subreddit.creatorId === session?.user?.id ? (
								<div className='flex justify-between gap-x-4 py-3'>
									<dt className='text-foreground'>You created this Room.</dt>
								</div>
							) : null}

							{isSubscribed && (
								<Link
									className={buttonVariants({
										className: 'mb-1 w-full',
									})}
									href={`/r/${slug}/submit`}
								>
									<ClipboardEdit className='aspect-square w-4' />
									<span className='pl-2'>Create a Post.</span>
								</Link>
							)}

							{subreddit.creatorId !== session?.user?.id ? (
								<SubscribeLeaveToggle
									isSubscribed={isSubscribed}
									subredditId={subreddit.id}
									subredditName={subreddit.name}
								/>
							) : null}
						</dl>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Layout;
