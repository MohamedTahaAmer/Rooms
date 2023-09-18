import { headers } from 'next/headers';
export function getHeaders() {
	const headersList = headers();
	return Object.fromEntries(headersList);

	// - from this return you can access
	// [
	// 	'host',                'connection',
	// 	'cache-control',       'sec-ch-ua',
	// 	'sec-ch-ua-mobile',    'user-agent',
	// 	'next-url',            'sec-ch-ua-platform',
	// 	'accept',              'sec-fetch-site',
	// 	'sec-fetch-mode',      'sec-fetch-dest',
	// 	'referer',             'accept-language',
	// 	'cookie',              'date',
	// 	'x-middleware-invoke', 'x-invoke-path',
	// 	'x-invoke-query',      'x-invoke-output',
	// 	'accept-encoding'
	// ]

	// {
	// 	host: 'localhost:3000',
	// 	connection: 'keep-alive',
	// 	referer: 'http://localhost:3000/store/7f24209f-b552-4039-94f0-1e3600839ad3/colors',
	// 	nextUrl: '/store/7f24209f-b552-4039-94f0-1e3600839ad3/billboards'
	// }
}
