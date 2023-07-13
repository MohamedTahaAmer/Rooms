import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { nanoid } from "nanoid";

export async function GET(req: Request) {
  // - upsert means, look for the data, if found then update, else insert
  const user = await db.user.upsert({
    where: { email: "test@test.com" },
    update: {
      // - if you found this user then updata it with nothing
    },
    create: {
      // - if you didn't find this user then create it using this data
      // note that prisma will add the unique string by it self
      name: "Test User",
      username: nanoid(10),
      password: await hash("test", 12),
    },
  });
  return new Response(JSON.stringify(user));
}
