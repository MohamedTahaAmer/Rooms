import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle';
import { buttonVariants } from '@/components/ui/Button';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Breadit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
};

const Layout = async ({
  children,
  params: { subredditName },
}: {
  children: ReactNode;
  params: { subredditName: string };
}) => {
  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: { name: subredditName },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  if (!subreddit) return notFound();

  const subscription = session?.user
    ? await db.subscription.findFirst({
        where: {
          subreddit: {
            name: subredditName,
          },
          user: {
            id: session.user.id,
          },
        },
      })
    : undefined;

  const isSubscribed = !!subscription;

  const memberCount = await db.subscription.count({
    where: {
      subreddit: {
        name: subredditName,
      },
    },
  });

  return (
    <div className='mx-auto h-full max-w-7xl pt-12 sm:container'>
      <div className='grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4'>
        <>{children}</>

        {/* info sidebar */}
        <div className='order-first h-fit overflow-hidden rounded-lg border border-gray-200 md:order-last'>
          <div className='bg-emerald-100 px-6 py-4 font-semibold'>
            About{' '}
            <Link
              className=' rounded-sm  px-1 py-1 shadow hover:text-yellow-500'
              href={`/r/${subredditName}`}
            >
              r/
              {subredditName}
            </Link>
          </div>
          <dl className='divide-y-2 divide-gray-100 bg-white px-6 py-4 text-sm leading-6'>
            <div className='flex flex-wrap justify-between gap-x-4 py-3'>
              <dt className='text-gray-500'>Created</dt>
              <dd className='ml-auto text-gray-700'>
                <time dateTime={subreddit.createdAt.toDateString()}>
                  {format(subreddit.createdAt, 'MMMM d, yyyy')}
                </time>
              </dd>
            </div>
            <div className='flex justify-between gap-x-4 py-3'>
              <dt className='text-gray-500'>Members</dt>
              <dd className='flex items-start gap-x-2'>
                <div className='text-gray-900'>{memberCount}</div>
              </dd>
            </div>
            {subreddit.creatorId === session?.user?.id ? (
              <dt className='gap-x-4 py-3 text-gray-500'>
                You created this community
              </dt>
            ) : (
              <SubscribeLeaveToggle
                isSubscribed={isSubscribed}
                subredditId={subreddit.id}
                subredditName={subredditName}
              />
            )}
            <div>
              {isSubscribed && (
                <Link
                  className={buttonVariants({
                    variant: 'default',
                    className: 'mb-6 mt-4 w-full',
                  })}
                  href={`/r/${subredditName}/submit`}
                >
                  Create Post
                </Link>
              )}
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Layout;
