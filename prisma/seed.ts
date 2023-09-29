import { PrismaClient } from '@prisma/client';
import { titles } from './titles';
import { content } from './content';

const db = new PrismaClient();

async function main() {
	await db.subreddit.createMany({
		data: [
			{ name: 'TypeScript' },
			{ name: 'React' },
			{ name: 'Next.js' },
			{ name: 'Postgres' },
			{ name: 'Prisma' },
			{ name: 'NextAuth' },
			{ name: 'React-Query' },
			{ name: 'Tailwind' },
			{ name: 'Shadcn-UI' },
		],
	});

	const authorId = 'd4ad2f3e-e682-4c63-8a99-e5a9dde9b20a';
	const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	const ids = {
		Next: 'bc7ce76d-7346-4f5c-b1a7-3f1551300334',
		TS: '774c48c7-7098-4766-ba38-64b562af5c9d',
		React: '9d30dd80-c572-4c61-8171-cd2353a6fc2f',
		RQ: '52e9f518-5210-4cf9-b2ce-4ca18af321c8',
		Tailwind: 'd4606a69-7f7c-45b2-be93-d8476ccbf7cd',
		Shad: '8f35c58c-d001-4bcf-9061-b41bd25e820e',
		Prisma: 'c02e93f7-151f-4a8e-90a9-dc86a37c92d0',
		NextAuth: 'b973e5f1-3e64-43e0-b9d9-15e24cb9d28d',
		postgres: '6e3ef387-2ba2-4c0d-a23d-574177c47399',
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
