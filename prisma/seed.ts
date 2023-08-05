import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // const subreddit = await prisma.subreddit.upsert({
  //   where: { name: "Test" },
  //   update: {},
  //   create: {
  //     creatorId: "Test creator",
  //     name: "Test",
  //   },
  // });
  // subreddit
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit(1);
  });
