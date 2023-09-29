
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();
globalForPrisma.prisma = db;

const test = async () => {
  const subreddits = await db.subreddit.findMany();
  console.log(subreddits);
};
test();
