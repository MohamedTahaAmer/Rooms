import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: "LogIn Required." }, { status: 401 });
    }

    const body = await req.json();
    const { subredditId } = SubredditSubscriptionValidator.parse(body);

    // see if he isn't subscribed already
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return NextResponse.json(
        { message: "You're not subscribed to this subreddit" },
        { status: 409 }
      );
    }

    // see if he is the creator
    const subreddit = await db.subreddit.findFirst({
      where: { id: subredditId, creatorId: session.user.id },
    });

    if (subreddit) {
      return NextResponse.json(
        { message: "Creator Of a subReddit, can't unSubscribe from it" },
        { status: 409 }
      );
    }

    // unsubscribe
    await db.subscription.delete({
      where: {
        userId_subredditId: { subredditId, userId: session.user.id },
      },
    });

    return NextResponse.json({ subredditId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = fromZodError(error).details[0].message;
      return NextResponse.json({ message }, { status: 422 });
    }

    return NextResponse.json(
      { message: "Could not unSubscribe at this time. Please try later" },
      { status: 500 }
    );
  }
}
