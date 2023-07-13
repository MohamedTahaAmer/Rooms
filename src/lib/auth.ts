import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter"; // >(1:02)
import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "UserName",
          type: "username",
          placeholder: "MohamedTaha",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },
      async authorize(credentials, req) {
        // - in here we create the use on signIn
        credentials;
        req;

        if (!credentials?.username || !credentials.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            username: credentials.username,
          },
        });

        if (!user || !(await compare(credentials.password, user.password!))) {
          return null;
        }

        return {
          id: user.id,
          username: user.username,
          name: user.name,
          image: user.image,
        };

      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      // - here you set the session depending on the token's data
      token;
      session;
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image as string;
        session.user.username = token.username;
      }

      session;
      return session;
    }, 

    // >(1:10)
    async jwt({ token, user }) {
      // - here you set the token depending on the use's data
      token;
      user;
      const dbUser = await db.user.findFirst({
        where: {
          username: token.username,
        },
      });

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }
 
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
        username: dbUser.username,
      };
    },
    redirect() {
      // - this determins where ths user should go after signIn()
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
