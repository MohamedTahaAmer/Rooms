import { PrismaClient } from '@prisma/client';
import { titles } from './titles';
import { content } from './content';
import nextAuth from 'next-auth';

const db = new PrismaClient();

async function main() {
	const Next = await db.subreddit.upsert({
		where: { name: 'Next.js' },
		create: { name: 'Next.js' },
		update: {},
	});
	const React = await db.subreddit.upsert({
		where: { name: 'React' },
		create: { name: 'React' },
		update: {},
	});
	const TypeScript = await db.subreddit.upsert({
		where: { name: 'TypeScript' },
		create: { name: 'TypeScript' },
		update: {},
	});
	const Postgres = await db.subreddit.upsert({
		where: { name: 'Postgres' },
		create: { name: 'Postgres' },
		update: {},
	});
	const Prisma = await db.subreddit.upsert({
		where: { name: 'Prisma' },
		create: { name: 'Prisma' },
		update: {},
	});
	const NextAuth = await db.subreddit.upsert({
		where: { name: 'NextAuth' },
		create: { name: 'NextAuth' },
		update: {},
	});
	const RQ = await db.subreddit.upsert({
		where: { name: 'React-Query' },
		create: { name: 'React-Query' },
		update: {},
	});
	const Tailwind = await db.subreddit.upsert({
		where: { name: 'Tailwind' },
		create: { name: 'Tailwind' },
		update: {},
	});
	const Shad = await db.subreddit.upsert({
		where: { name: 'Shadcn-UI' },
		create: { name: 'Shadcn-UI' },
		update: {},
	});

	const user = await db.user.findFirst();
	if (!user) return;

	const authorId = user.id;
	const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	const ids = {
		Next: Next.id,
		TS: TypeScript.id,
		React: React.id,
		RQ: RQ.id,
		Tailwind: Tailwind.id,
		Shad: Shad.id,
		Prisma: Prisma.id,
		NextAuth: NextAuth.id,
		postgres: Postgres.id,
	};

	nums.map(async (i) => {
		await db.post.createMany({
			data: [
				{
					title: titles.Next[i],
					authorId,
					subredditId: ids.Next,
					content,
				},
				{
					title: titles.RQ[i],
					authorId,
					subredditId: ids.RQ,
					content,
				},
				{
					title: titles.React[i],
					authorId,
					subredditId: ids.React,
					content,
				},
				{
					title: titles.TS[i],
					authorId,
					subredditId: ids.TS,
					content,
				},
				{
					title: titles.nextAuth[i],
					authorId,
					subredditId: ids.NextAuth,
					content,
				},
				{
					title: titles.shadcn[i],
					authorId,
					subredditId: ids.Shad,
					content,
				},
				{
					title: titles.postgres[i],
					authorId,
					subredditId: ids.postgres,
					content,
				},
				{
					title: titles.Tailwind[i],
					authorId,
					subredditId: ids.Tailwind,
					content,
				},
			],
		});
	});
}
main()
	.then(() => db.$disconnect())
	.catch(async (e) => {
		e;
		await db.$disconnect();
		process.exit(1);
	});
