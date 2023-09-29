import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const subreddit = await prisma.subreddit.createMany({
		data: [
			{ name: 'TypeScript' },
			{ name: 'React' },
			{ name: 'Next.js' },
			{ name: 'Postgres' },
			{ name: 'Prisma' },
			{ name: 'NextAuth' },
			{ name: 'React Query' },
			{ name: 'Tailwind' },
			{ name: 'Shadcn-UI' },
		],
	});
}
main()
	.then(() => prisma.$disconnect())
	.catch(async (e) => {
		e;
		await prisma.$disconnect();
		process.exit(1);
	});
