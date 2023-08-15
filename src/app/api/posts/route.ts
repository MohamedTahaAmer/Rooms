import { getAuthSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ZodError, z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export async function GET(req: Request) {
  const session = await getAuthSession();

  const url = new URL(req.url);

  try {
    const { limit, page, subredditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subredditName: z.string().nullish(),
      })
      .parse({
        subredditName: url.searchParams.get('subredditName'),
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
      });

    // by default get all the posts
    let whereClause = {};

    if (subredditName) {
      // if inside a subreddit, then get the posts for it only
      whereClause = {
        subreddit: {
          name: subredditName,
        },
      };
    } else {
      if (session) {
        const followedCommunities = await db.subscription.findMany({
          where: {
            userId: session.user.id,
          },
          include: {
            subreddit: true,
          },
        });

        if (followedCommunities) {
          // if in home and session and followedCommunitiesIds then get his comunities only
          whereClause = {
            subreddit: {
              name: {
                in: followedCommunities.map((sub) => sub.subreddit.name),
              },
            },
          };
        }
      }
    }

    const posts = await db.post.findMany({
      where: whereClause,
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      // here you must order the posts, to make sure that you are getting the next two posts each time you hit this end point
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        subreddit: true,
        votes: true,
        author: true,
        comments: true,
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    if (error instanceof ZodError) {
      const message = fromZodError(error).details[0].message;
      return NextResponse.json({ message }, { status: 422 });
    }
    return NextResponse.json(
      { message: 'Could not fetch posts.' },
      { status: 500 }
    );
  }
}
