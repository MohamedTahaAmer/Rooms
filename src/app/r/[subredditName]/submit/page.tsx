import Editor from "@/components/Editor";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface pageProps {
  params: {
    subredditName: string;
  };
}

const page = async ({ params: { subredditName } }: pageProps) => {
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: subredditName,
    },
  });

  if (!subreddit) return notFound();

  return (
    <ul className="flex flex-col gap-6 md:col-span-2">
      <div className="flex flex-col items-start gap-6">
        {/* heading */}
        <div className="border-b border-gray-200 pb-5">
          <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
            <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
              Create Post
            </h3>
            <p className="ml-2 mt-1 truncate text-sm text-gray-500">
              in r/{subredditName}
            </p>
          </div>
        </div>

        {/* form */}
        <Editor subredditId={subreddit.id} />
      </div>
    </ul>
  );
};

export default page;
