import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
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

    const { title, content, subredditId } = PostValidator.parse(body);

    // verify user is subscribed to passed subreddit id
    const subscription = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { message: "Subscribe to post" },
        { status: 403 }
      );
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subredditId,
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
