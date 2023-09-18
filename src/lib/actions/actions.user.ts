'use server';
import { getAuthSession } from '../auth';
import { db } from '../db';

export async function getAuthedUser() {
	const session = await getAuthSession();
	if (!session) return null;
	const dbUser = await db.user.findFirst({
		where: {
			id: session?.user.id,
		},
	});
	if (!dbUser) return null;
	return dbUser;
}
