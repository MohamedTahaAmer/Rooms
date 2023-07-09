import { db } from "@/lib/db";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = (await req.json()) as {
      name: string;
      email: string;
      password: string;
    };

    const user = await db.user.findUnique({
      where: { email },
    });

    if (user !== null) {
      return new Response(JSON.stringify({ user, message: "User already exists" }));
    }

    const hashed_password = await hash(password, 12);

    const newUser = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashed_password,
        image: "https://toolset.com/wp-content/uploads/2018/06/909657-profile_pic.png"
      },
    });

    return new Response(JSON.stringify({
      newUser
    }));
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
