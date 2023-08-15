import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';
import { PostVoteValidator } from '@/lib/validators/vote';
import { CachedPost } from '@/types/redis';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

const CACHE_AFTER_UPVOTES = 10;

// >(6:10)
export async function PATCH(req: Request) {
  try {
    // throw new Error('hi');
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: 'LogIn Required.' }, { status: 401 });
    }

    const body = await req.json();
    const { postId, voteType } = PostVoteValidator.parse(body);

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const existingVote = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    });

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        });

        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === 'UP') return acc + 1;
          if (vote.type === 'DOWN') return acc - 1;
          return acc;
        }, 0);

        // caching only the upvoted posts, not just the ones with heighest amount of votes
        if (votesAmt >= CACHE_AFTER_UPVOTES) {
          const cachePayload: CachedPost = {
            authorUsername: post.author.username ?? '',
            content: JSON.stringify(post.content),
            id: post.id,
            title: post.title,
            currentVote: null,
            createdAt: post.createdAt,
          };

          await redis.hset(`post:${postId}`, cachePayload);
          // 'hset' => set hash
          // the first argument is the key, the second is the value to be hashed
          // Store the post data as a hash
          // as redis is just a key value pair, and the value can't be a js object,
          // so to store an object, then you will have to store it as a hash
        }

        return NextResponse.json({ message: 'OK' });
      }

      // if vote type is different, update the vote // >(6:17)
      // - if the vote was up and the user clicked down, then we should toggle the vote.
      // - How will this prisma query acheive that?
      await db.vote.update({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      });

      // Recount the votesAmt   // >(6:18)
      const votesAmt = post.votes.reduce((acc, vote) => {
        if (vote.type === 'UP') return acc + 1;
        if (vote.type === 'DOWN') return acc - 1;
        return acc;
      }, 0);

      if (votesAmt >= CACHE_AFTER_UPVOTES) {
        const cachePayload: CachedPost = {
          authorUsername: post.author.username ?? '',
          content: JSON.stringify(post.content),
          id: post.id,
          title: post.title,
          currentVote: voteType,
          createdAt: post.createdAt,
        };

        await redis.hset(`post:${postId}`, cachePayload); // Store the post data as a hash
      }

      return NextResponse.json({ message: 'OK' });
    }

    // >(6:29)
    // - if no existing vote, create a new vote
    await db.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        postId,
      },
    });

    // >(6:29) there is alot of repetetion, on getting the post count and cashing it, -> move it to a function
    // Recount the votes
    const votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === 'UP') return acc + 1;
      if (vote.type === 'DOWN') return acc - 1;
      return acc;
    }, 0);

    if (votesAmt >= CACHE_AFTER_UPVOTES) {
      const cachePayload: CachedPost = {
        authorUsername: post.author.username ?? '',
        content: JSON.stringify(post.content),
        id: post.id,
        title: post.title,
        currentVote: voteType,
        createdAt: post.createdAt,
      };

      // >(6:27)
      await redis.hset(`post:${postId}`, cachePayload); // Store the post data as a hash
    }

    return NextResponse.json({ message: 'OK' });
  } catch (error) {
    if (error instanceof ZodError) {
      const message = fromZodError(error).details[0].message;
      return NextResponse.json({ message }, { status: 422 });
    }

    return NextResponse.json(
      {
        message: 'Could not register your vote at this time.',
      },
      { status: 500 }
    );
  }
}
