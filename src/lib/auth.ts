import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter"; // >(1:02)
import { nanoid } from "nanoid";
import { NextAuthOptions, getServerSession } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  // >(1:01)
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  // - by providing this pages option, we are telling nextauth that we will have our own page to handle the sign in and out

  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID!,
    //   clientSecret: process.env.GITHUB_SECRET!,
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "UserName",
          type: "username",
          placeholder: "MohamedTaha",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        credentials;
        req;

        // if (!credentials?.email || !credentials.password) {
        //   return null;
        // }

        // const user = await db.user.findUnique({
        //   where: {
        //     email: credentials.email,
        //   },
        // });

        // if (!user || !(await compare(credentials.password, user.password!))) {
        //   return null;
        // }

        // return {
        //   id: user.id,
        //   email: user.email,
        //   name: user.name,
        //   image: user.image,
        // };
        const user = { id: "42", name: "aa", password: "aa" };

        if (
          credentials?.username === user.name &&
          credentials?.password === user.password
        ) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      token;
      session;
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }

      session;
      return session;
    },

    // >(1:10)
    async jwt({ token, user }) {
      token;
      user;
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      if (!dbUser.username) {
        await db.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            username: nanoid(10),
          },
        });
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
      };
    },
    redirect() {
      return "/";
    },
    async signIn({ user }) {
      user;
      return true;
    },
  },
};

// >(1:18) i think that this should be used by the components to obtain the users session
export const getAuthSession = () => getServerSession(authOptions);
