import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/Button";
import { UserAccountNav } from "./UserAccountNav";
import SearchBar from "./SearchBar";

// >(1:19) by turning a component into an async one, then it's a server component
// - aren't all next components server ones untill we 'use client'
const Navbar = async () => {
  // >(1:19) although he created "getAuthSession" in the lib/auth file but he still imported the authOptions, and getServerSession to get the current user's session
  const session = await getServerSession(authOptions);
  return (
    <div className=" mx-auto fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
      <div className="container max-w-7xl h-full  flex items-center justify-between gap-2">
        {/* logo */}
        <Link href="/" className="flex gap-2 items-center">
          <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <p className="hidden text-zinc-700 text-sm font-medium md:block">
            Breadit
          </p>
        </Link>

        {/* search bar */}
        <SearchBar />

        {/* actions */}
        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          // >(0:28)
          // >(1:17) this /sign-in page is set in NextAuthOptions pages: {signIn: '/sign-in',}
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
