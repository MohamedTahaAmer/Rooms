import { db } from '@/lib/db';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { User } from '@prisma/client';
import { nanoid } from 'nanoid';
import { NextAuthOptions, getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(db),
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/sign-in',
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async session({ token, session }) {
			if (token) {
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.image = token.picture;
				session.user.username = token.username;
			}

			return session;
		},

		async jwt({ token, user, trigger, session }) {
			// this user object is present only for the first time the user logs in
			if (user) {
				token.id = user.id;

				// this 'prismaUser' is used just let TS allow us to access 'user.username' which doens't exist on type 'AdapterUser' from nextAuth, but exists only on type 'User' from prismaClient
				const prismaUser = user as User;
				// console.log('\x1b[31m%s\x1b[0m', user);
				if (!prismaUser.username) {
					const dbUser = await db.user.update({
						where: {
							id: user.id,
						},
						data: {
							username: nanoid(10),
						},
					});
					// console.log('\x1b[33m%s\x1b[0m', dbUser);
					token.username = dbUser.username;
				} else {
					token.username = prismaUser.username;
				}
			}

			// this "session" is an object sent from the client side "update()"
			if (trigger === 'update') {
				session.username && (token.username = session.username);
				session.image && (token.picture = session.image);
			}

			// note that the token.username is set only when the user signs in or up for the first time, and is only updated when we trigger an update() from the client

			const retToken = {
				id: token.id,
				name: token.name,
				email: token.email,
				picture: token.picture,
				username: token.username,
			};

			return retToken;
		},
		redirect() {
			return '/';
		},
	},
};

export const getAuthSession = () => getServerSession(authOptions);
