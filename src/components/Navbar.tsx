import Link from "next/link";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/Button";

function Navbar() {
  return (
    <div className="fixed inset-x-0 top-0 z-[10] h-fit border-b border-zinc-300 bg-zinc-100 py-2">
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 ">
          <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6"/>
          <p className="hidden text-zinc-700 text-sm font-medium md:block">Breadit</p>
        </Link>
        <Link href="/sign-in" className={buttonVariants()}>
          Sing In
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
