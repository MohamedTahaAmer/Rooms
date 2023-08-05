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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { subredditId } = SubredditSubscriptionValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (subscriptionExists) {
      return NextResponse.json(
        { message: "You've already subscribed to this subreddit" },
        {
          status: 409,
        }
      );
    }

    await db.subscription.create({
      data: {
        subredditId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ subredditId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = fromZodError(error).details[0].message;
      return NextResponse.json({ message }, { status: 422 });
    }

    return NextResponse.json(
      {
        message:
          "Could not subscribe to subreddit at this time. Please try later",
      },
      { status: 500 }
    );
  }
}
