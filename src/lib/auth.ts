import { db } from '@/lib/db';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
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

		async jwt({ token, trigger, session }): Promise<any> {
			let dbUser = await db.user.findUnique({
				where: {
					email: token.email,
				},
			});
			if (!dbUser) return null;

			if (!dbUser.username) {
				dbUser = await db.user.update({
					where: {
						email: token.email,
					},
					data: {
						username: nanoid(10),
					},
				});
			}

			if (!token.id) token.id = dbUser.id;

			if (trigger === 'update') {
				session.username && (token.username = session.username);
				session.image && (token.picture = session.image);
			}

			const retToken = {
				id: dbUser.id,
				name: dbUser.name,
				email: dbUser.email,
				picture: dbUser.image,
				username: dbUser.username,
			};
			return retToken;
		},
		redirect() {
			return '/';
		},
	},
};

export const getAuthSession = () => getServerSession(authOptions);
