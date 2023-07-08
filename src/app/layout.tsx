import Navbar from '@/components/Navbar'
import { cn } from '@/lib/utils' // >(0:15)
import { Inter } from 'next/font/google' // >(0:15)
import Providers from '@/components/Providers'
import { Toaster } from '@/components/ui/Toaster'

import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] }) // >(0:15)

export const metadata = { 
  title: 'Breadit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

export default function RootLayout({
  children,
  // >(1:41) this authModal is passed to the RootLayout by default as we created an @ route in the same level as this layout
  authModal,
}: {
  children: React.ReactNode
  authModal: React.ReactNode
}) {
  return (
    <html
      lang='en'
      className={cn(
        'bg-white text-slate-900 antialiased light',
        inter.className
      )}>
      <body className='min-h-screen pt-12 bg-slate-50 antialiased'>
        {/* // >(2:36) */}
        <Providers>

          {/* // >(1:0) this comment below is to disaple TS complaint that the Navbar is a server component */}
          {/* @ts-expect-error Server Component */}
          <Navbar />
          {authModal}

          <div className='container max-w-7xl mx-auto h-full pt-12'>
            {children}
          </div>
        </Providers>
        {/* // >(0:56) provideing the toaster for all the toasts to work */}
        <Toaster />
      </body>
    </html>
  )
}
