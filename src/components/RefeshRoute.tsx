'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

console.log('Expression2');
const RefeshRoute = () => {
	console.log('Expression');
	const router = useRouter();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		console.log('\x1b[31m%s\x1b[0m', 'in');
		if (!isMounted) {
			setIsMounted(true);
			return;
		}
		router.refresh();
	}, [isMounted, router]);

	return <></>;
};

export default RefeshRoute;
