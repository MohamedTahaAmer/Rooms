import { getAuthSession } from "@/lib/auth";
import type { Post, Vote } from "@prisma/client";
import { notFound } from "next/navigation";
import PostVoteClient from "./PostVoteClient";

interface PostVoteServerProps {
  postId: string;
  initialVotesAmt?: number;
  initialVote?: Vote["type"] | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
  // - this is how to make a type of a function that takes no params and returns a promise, that promise resolves to an object that has a post and an array of votes in it
}

// >(7:30) this is an programatic delay
// > this is how to disaple eslint for the next line
// eslint-disable-next-line no-unused-vars 
// const delay = (ms: number): Promise<number> => new Promise((resolve:(ms:number)=> void) => setTimeout((ms: number)=> resolve(ms), ms));
// delay(500)

/**
 * We split the PostVotes into a client and a server component to allow for dynamic data
 * fetching inside of this component, allowing for faster page loads via suspense streaming.
 * We also have the option to fetch this info on a page-level and pass it in.
 *
 */


// >(7:15)
// >(7:18) you can't use <> TS syntax and make the function async, so he used the : syntax to declare the props type
const PostVoteServer = async ({
  postId,
  initialVotesAmt,
  initialVote,
  getData,
}: PostVoteServerProps) => {
  const session = await getAuthSession();

  let _votesAmt: number = 0;
  let _currentVote: Vote["type"] | null | undefined = undefined;

  if (getData) {
    // fetch data in component
    const post = await getData();
    if (!post) return notFound();

    _votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    _currentVote = post.votes.find(
      (vote) => vote.userId === session?.user?.id
    )?.type;
  } else {
    // passed as props
    // - this ! is used as this initialVotesAmt is a number or undefined, and the _VotesAmt is only a number, so this ! is to ignore the undefined in the initialVotesAmt
    _votesAmt = initialVotesAmt!;
    _currentVote = initialVote;
  }

  return (
    <PostVoteClient
      postId={postId}
      initialVotesAmt={_votesAmt}
      initialVote={_currentVote}
    />
  );
};

export default PostVoteServer;
