"use client";

import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { buttonVariants } from "./ui/Button";

interface SignInLinkProps {}

const SignInLink: FC<SignInLinkProps> = ({}) => {
  const [href, setHref] = useState('/sing-in')
  useEffect(() => {
    setHref( `/sign-in?callbackUrl=${window.location?.pathname}`);
  }, []);

  href;
  return (
    <Link href={href} className={buttonVariants()}>
      Sing In
    </Link>
  );
};

export default SignInLink;
