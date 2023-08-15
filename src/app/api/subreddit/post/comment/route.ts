import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { CommentValidator } from '@/lib/validators/comment';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: 'Login Requried' }, { status: 401 });
    }

    const body = await req.json();
    const { postId, text, replyToId } = CommentValidator.parse(body);

    await db.comment.create({
      // the create doesn't take a where clouse
      data: {
        text,
        postId,
        authorId: session.user.id,
        replyToId,
      },
    });
    return NextResponse.json({ message: 'OK' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = fromZodError(error).details[0].message;
      return NextResponse.json({ message }, { status: 422 });
    }
    return NextResponse.json(
      {
        message: 'Could not Create a Comment.',
      },
      { status: 500 }
    );
  }
}
