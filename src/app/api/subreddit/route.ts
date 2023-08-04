import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";
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
    const { name } = SubredditValidator.parse(body);

    // check if subreddit already exists
    const subredditExists = await db.subreddit.findFirst({
      where: { name },
    });

    if (subredditExists) {
      return NextResponse.json(
        { message: "Subreddit already exists" },
        { status: 409 }
      );
    }

    // create subreddit and associate it with the user
    const subreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    // creator also has to be subscribed
    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subreddit.id,
      },
    });

    // the default status is 200
    return NextResponse.json({ subreddit: subreddit.name });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = fromZodError(error).details[0].message;
      return NextResponse.json({ message: message }, { status: 422 });
    }

    return NextResponse.json(
      { message: "Could not create subreddit" },
      { status: 500 }
    );
  }
}
