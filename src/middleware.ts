import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
const { match } = require('path-to-regexp');

function log(req: NextRequest, protectedPath: boolean = false) {
	console.log(
		'\x1b[32m%s\x1b[33m%s\x1b[0m',
		req.nextUrl.href.replace(req.nextUrl.origin, ''),
		` - ${protectedPath ? '🔐' : '📢'}`,
	);
}

function matchPathes(req: NextRequest, pathes: string[]): boolean {
	return !!pathes.find((path) => {
		const fn = match(path, { decode: decodeURIComponent });
		if (fn(req.nextUrl.pathname)) return true;
	});
}

async function redirectUnAuthed(req: NextRequest) {
	const token = await getToken({ req });
	if (!token) {
		return NextResponse.redirect(new URL('/sign-in', req.nextUrl));
	}
}
async function redirectAuthed(req: NextRequest) {
	const token = await getToken({ req });
	if (token) {
		return NextResponse.redirect(new URL('/', req.nextUrl));
	}
}

export async function middleware(req: NextRequest) {
	const pathesToProtect = ['/r/:path/submit', '/r/create'];
	const protectedPath = matchPathes(req, pathesToProtect);

	// 1- log the route status "protected or not"
	log(req, protectedPath);

	// 2- redirect unAuthed users
	if (protectedPath) return await redirectUnAuthed(req);

	// 3- redirect authed users
	const puplicOnlyPathes = ['/sign-in', '/sign-up'];
	const isPuplicOnly = matchPathes(req, puplicOnlyPathes);
	if (isPuplicOnly) return await redirectAuthed(req);
}

export const config = {
	// don't match routes that start with "/_next"
	matcher: ['/((?!_next).*)'],
};
