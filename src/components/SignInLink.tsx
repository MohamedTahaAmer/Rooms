"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "./ui/Button";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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
  const router = useRouter();
  const href = "/";
  // const [href, setHref] = useState("/sign-in");
  // const [mounted, setMounted] = useState(false);
  // console.log(href);

  // useEffect(() => {
  //   console.log('in')
  //   setMounted(true);
  //   if (window.location?.pathname !== "/sign-in") {
  //     setHref(`/sign-in?callbackUrl=${window.location?.pathname}`);
  //   }
  // }, []);

  // if (!mounted) {
  //   return null;
  // }
  const fetchURL = () => {
    return window.location.pathname;
  };

  const { data, isLoading, error } = useQuery({
    queryFn: fetchURL,
    queryKey: "currentUserData",
  });
  console.log(data);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  href;
  return (
    <button
      onClick={() => router.push(href)}
      className={buttonVariants({ variant })}
    >
      Sing In
    </button>
  );
};

export default SignInLink;
