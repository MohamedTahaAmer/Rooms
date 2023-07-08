import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import ToFeedButton from "@/components/ToFeedButton";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Breadit",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

// >(3:17) he created thsi layout to style all the subreddits pages, single post page, and the ceate post page
const Layout = async ({
  children,
  params: { slug },
}: {
  children: ReactNode;
  params: { slug: string };
}) => {
  const session = await getAuthSession();

  // >(3:22) he said something about request being dedupep in next.js
    //  the subsequent identical requests are intercepted and resolved using the response from the initial request.
    // - as in this layout we will fetch the subreddit as we need to diplay info about it, even if we are visting the create post route,
    // - and we are also fetching the subreddit data(using the same http request in the subreddits page),
    // - so when we render the subreddits page, next js will send only this http request in the layout and send back it's response to the http request in the page.tsx
      // < why don't we just pass the subreddit from here to the page
        // as the page isn't just a component rendered by this layout, this layout renders all of it's children, not just the subreddit page
  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  // >(3:24) instead of using thie !, we can swap the ternary operator conditions
  // >(3:25:20) his hover will only show the type name, but in my VSCode version, my hover over a variable will show the type and implementation which make it ocer complecated, so i'll download the latest version of vscode and see it i get the same results
  // - i updated it but it is still the same
  const subscription = session?.user
    ? await db.subscription.findFirst({
        where: {
          subreddit: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      })
    : undefined;

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
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      <div>
        <ToFeedButton />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <ul className="flex flex-col col-span-2 space-y-6">{children}</ul>

          {/* info sidebar */}
          <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
            <div className="px-6 py-4">
              {/* // >(3:30) he is getting the name from the subreddit, not from the slug and in this app, the two are the same */}
              <p className="font-semibold py-3">About r/{subreddit.name}</p>
            </div>
            <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
              <div className="flex justify-between gap-x-4 py-3">

                {/* // >(3:27) */}
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-700">
                  {/* discription List, Term, Detail */}

                  {/* // >(3:28) this dateTime is for accessablity */}
                  <time dateTime={subreddit.createdAt.toDateString()}>

                    {/* // >(3:29) */}
                    {format(subreddit.createdAt, "MMMM d, yyyy")}
                  </time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Members</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="text-gray-900">{memberCount}</div>
                </dd>
              </div>
              {subreddit.creatorId === session?.user?.id ? (
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">You created this community</dt>
                </div>
              ) : null}

              {subreddit.creatorId !== session?.user?.id ? (
                <SubscribeLeaveToggle
                  isSubscribed={isSubscribed}
                  subredditId={subreddit.id}
                  subredditName={subreddit.name}
                />
              ) : null}
              <Link
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full mb-6",
                })}
                href={`/r/${slug}/submit`}
              >
                Create Post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
