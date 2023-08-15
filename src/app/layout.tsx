import { Inter } from 'next/font/google';

import { cn } from '@/lib/utils';
import '@/styles/globals.css';

import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/Toaster';

import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Breadit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
};

const inter = Inter({ subsets: ['latin'] });
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
        'light bg-white text-slate-900 antialiased',
        inter.className
      )}
    >
      <body className='min-h-screen bg-slate-50 pt-12 antialiased'>
        <Providers>
          {/* @ts-expect-error Server Component */}
          <Navbar
          // - this server components is doing no thing, the @ts-expect-error is the one doing all the ignoring
          />
          {authModal}
          <div className='mx-auto h-full max-w-7xl px-2 pt-12 lg:px-8'>
            {children}
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
