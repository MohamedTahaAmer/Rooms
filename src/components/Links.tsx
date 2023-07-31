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
      <Link
        href="/test"
        className={cn(buttonVariants({ variant: "outline" }), "self-start")}
      >
        P server
      </Link>
      <Link
        href="/test2"
        className={cn(buttonVariants({ variant: "outline" }), "self-start")}
      >
        P client
      </Link>
      <Link
        href="/test3"
        className={cn(buttonVariants({ variant: "outline" }), "self-start")}
      >
        not
      </Link>
      <CBLink variant="outline" href="/sign-in" text="Sign in" />
      <CBLink variant="outline" href="/sign-up" text="Sign up" />
    </div>
  );
};

export default Links;
