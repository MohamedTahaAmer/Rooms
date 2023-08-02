"use client";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/Button";
import Link from "next/link";
import { useState } from "react";

// - if you changed the button variants, then to get this type, just hover over the buttonVariants above and copy tge variants type
type Variant = {
  default: string;
  destructive: string;
  outline: string;
  subtle: string;
  ghost: string;
  link: string;
};

type CBLinkProps = {
  variant?: keyof Variant;
  href: string;
  text: string;
  className?: string;
};

// CallBackLink, is a button that accepts ..., and adds a callbackURL depending on it's current route
const CBLink = ({
  variant, // - if you wanna use one of the shad-cn styles
  href, // - the route you wanna go to
  text, // - the text of the button
  className = "", // - custom styles
}: CBLinkProps) => {
  const [hrefState, setHrefState] = useState("/");
  function handleMouseHover() {
    let callback = window.location.pathname;
    if (callback === "/sign-in" || callback === "/sign-up") callback = "/";
    setHrefState(`${href}?callbackUrl=${callback}`);
  }

  let cssClasses = className;
  if (variant) cssClasses = cn(buttonVariants({ variant }), className);

  return (
    <Link
      href={hrefState}
      onMouseEnter={handleMouseHover}
      className={cssClasses}
    >
      {text}
    </Link>
  );
};

export default CBLink;
