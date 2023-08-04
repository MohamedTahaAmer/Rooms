"use client";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import CBLink from "./CBLink";

interface LinksProps {
  className?: string;
}
const Links = ({ className }: LinksProps) => {
  return (
    <div className={cn(className, "flex items-center justify-center gap-2")}>
      <Link href="/test" className={cn(buttonVariants(), "self-start")}>
        test
      </Link>
      <Link
        href="/test2"
        className={cn(buttonVariants({ variant: "subtle" }), "self-start")}
      >
        2
      </Link>
      <Link
        href="/test3"
        className={cn(buttonVariants({ variant: "outline" }), "self-start")}
      >
        3
      </Link>
      <Link
        href="/test4"
        className={cn(buttonVariants({ variant: "outline" }), "self-start")}
      >
        4
      </Link>
      <CBLink variant="outline" href="/sign-in" text="Sign in" />
      <CBLink variant="link" href="/sign-up" text="Sign up" />
      <Link
        href="/test3djkflksdj"
        className={cn(buttonVariants({ variant: "outline" }), "self-start")}
      >
        notFound
      </Link>
    </div>
  );
};

export default Links;
