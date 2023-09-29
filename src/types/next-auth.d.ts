import type { User } from 'next-auth';

declare module 'next-auth/jwt' {
	// eslint-disable-next-line
	type JWT = {
		name?: string;
		email?: string;
		picture?: string;
		username?: string;
		id: string;
	};
}

declare module 'next-auth' {
	// eslint-disable-next-line
	interface Session {
		user: User & {
			username?: string;
		};
	}
}
