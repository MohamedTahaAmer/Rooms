import FeaturedRooms from '@/components/FeaturedRooms';
import CustomFeed from '@/components/homepage/CustomFeed';
import GeneralFeed from '@/components/homepage/GeneralFeed';
import { buttonVariants } from '@/components/ui/Button';
import { getAuthSession } from '@/lib/auth';
import { Home as HomeIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function Home() {
	const session = await getAuthSession();

	return (
		<>
			<h1 className='text-3xl font-bold md:text-4xl'>Your feed</h1>
			<div className='grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4'>
				{/* @ts-expect-error server component */}
				{session ? <CustomFeed session={session} /> : <GeneralFeed />}

				{/* subreddit info */}
				<div className='order-first  md:order-last'>
					<div className='shadoww h-fit overflow-hidden rounded-lg '>
						<div className='bg-violet-200 px-6 py-4 dark:bg-violet-400'>
							<p className='flex items-center gap-1.5 py-3 font-semibold dark:text-background'>
								<HomeIcon className='h-4 w-4' />
								Home
							</p>
						</div>
						<dl className='-my-3 divide-y divide-background px-6 py-4 text-sm leading-6'>
							<div className='flex justify-between gap-x-4 py-3'>
								<p className='text-foreground'>
									Your personal Rooms frontpage. Come here to check in with your
									favorite Rooms.
								</p>
							</div>

							<Link
								className={buttonVariants({
									className: 'mb-6 mt-4 w-full',
								})}
								href={`/r/create`}
							>
								Create a Room
							</Link>
						</dl>
					</div>
					<div className='p-2'></div>
					<div className='shadoww  h-fit overflow-hidden rounded-lg'>
						<div className='bg-violet-200 px-6 py-4 dark:bg-violet-400'>
							<p className='flex items-center gap-1.5 py-3 font-semibold dark:text-background'>
								<span className='relative aspect-square  w-5  '>
									<Image src='/table.svg' fill sizes='100px' alt='Table' />
								</span>
								Featured Rooms.
							</p>
						</div>
						{/* @ts-expect-error  */}
						<FeaturedRooms />
					</div>
				</div>
			</div>
		</>
	);
}
