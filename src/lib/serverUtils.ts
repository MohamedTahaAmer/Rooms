import bcrypt from 'bcryptjs';

export function delay(i: number) {
	return new Promise((resolve) => setInterval(() => resolve(i), i));
}

export async function hashPassword(password: string): Promise<string> {
	try {
		const saltRounds = 10; // You can adjust the number of salt rounds as needed
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		return hashedPassword;
	} catch (error) {
		throw new Error('Error hashing the password');
	}
}

export async function checkPassword(
	password: string,
	hash: string,
): Promise<boolean> {
	try {
		const isMatch = await bcrypt.compare(password, hash);
		return isMatch;
	} catch (error) {
		throw new Error('Error checking the password');
	}
}
