import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentVoteValidator } from "@/lib/validators/vote";
import { NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Login Requried" }, { status: 401 });
    }

    const body = await req.json();
    const { commentId, voteType } = CommentVoteValidator.parse(body);

    // check if user has already voted on this post
    const existingVote = await db.commentVote.findFirst({
      where: {
        userId: session.user.id,
        commentId,
      },
    });

    if (existingVote) {
      // if vote type is the same as existing vote, delete the vote
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            // this is how to access a record using composite index
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
        });
        return NextResponse.json({ message: "OK" });
      } else {
        // if vote type is different, update the vote
        await db.commentVote.update({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
          data: {
            // in update you don't have to send the hole data, just the keys that you wanna update
            type: voteType,
          },
        });
        return NextResponse.json({ message: "OK" });
      }
    }

    // if no existing vote, create a new vote
    await db.commentVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        commentId,
      },
    });
    return NextResponse.json({ message: "OK" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = fromZodError(error).details[0].message;
      return NextResponse.json({ message }, { status: 422 });
    }

    return NextResponse.json(
      {
        message: "Could not post to subreddit at this time. Please try later.",
      },
      { status: 500 }
    );
  }
}
