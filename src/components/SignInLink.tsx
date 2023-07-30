"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "./ui/Button";
// export const dynamic = "force-dynamic";

// - if you changed the butoon variants, then to get this type, just hover over the buttonVariants above and copy tge variants type
type Variant = {
  default: string;
  destructive: string;
  outline: string;
  subtle: string;
  ghost: string;
  link: string;
};

type SignInLinkProps = {
  variant?: keyof Variant;
};

const SignInLink = ({ variant = "default" }: SignInLinkProps) => {
  const [href, setHref] = useState("/sign-in");
  console.log(href)
  useEffect(() => {
    if (window.location?.pathname !== "/sign-in") {
      setHref(`/sign-in?callbackUrl=${window.location?.pathname}`);
    }
  }, []);

  href;
  return (
    <button onClick={()=> window.location.assign(href)} className={buttonVariants({ variant })}>
      Sing In
    </button>
  );
};

export default SignInLink;
