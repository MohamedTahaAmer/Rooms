import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/Toaster';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Rooms',
	description: 'A Reddit clone built with Next.js and TypeScript.',
	icons: '/favIcon.svg',
};

export default function RootLayout({
	children,
	authModal,
}: {
	children: React.ReactNode;
	authModal: React.ReactNode;
}) {
	return (
		<html
			lang='en'
			className={cn(
				'bg-background text-foreground antialiased',
				inter.className,
			)}
		>
			{/* <body className='min-h-screen bg-background pt-12 antialiased'> */}
			<body
				className={cn(
					'min-h-screen bg-background pt-12 antialiased',
					inter.className,
				)}
			>
				<Providers>
					{/* @ts-expect-error Server Component */}
					<Navbar />
					{authModal}

					<div className='container mx-auto h-full max-w-7xl pt-12 max-sm:px-2'>
						{children}
					</div>
				</Providers>
				<Toaster />
			</body>
		</html>
	);
}
