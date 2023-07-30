import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import "@/styles/globals.css";

import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/Toaster";

import Navbar from "@/components/Navbar";
import Links from "@/components/Links";

export const metadata = {
  title: "Breadit",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "light bg-white text-slate-900 antialiased",
        inter.className
      )}
    >
      <body className="min-h-screen bg-slate-50 pt-12 antialiased">
        <Providers>
          {/* @ts-expect-error Server Component */}
          <Navbar />
          {authModal}
          <Links className="relative z-[10] mt-4" />
          <div className="container mx-auto h-full max-w-7xl pt-12">
            {children}
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
