import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    subredditName: string;
  };
}
const page = async ({ params }: PageProps) => {
  const { subredditName } = params;

  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: { name: subredditName },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
      },
    },
  });

  if (!subreddit) return notFound();

  return (
    <ul className="flex flex-col gap-6 md:col-span-2">
      <h1 className="h-14 text-3xl font-bold md:text-4xl">
        r/{subreddit.name}
      </h1>
      <MiniCreatePost session={session} />
      <PostFeed
        initialPosts={subreddit.posts}
        userId={session?.user.id}
        subredditName={subreddit.name}
      />
    </ul>
  );
};

export default page;
