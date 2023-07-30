"use client";

import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "./ui/DropdownMenu";


const SignOutItem = () => {
  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onSelect={(event) => {
        event.preventDefault();
        signOut({
          callbackUrl: `${window.location.href}`,
        });
      }}
    >
      Sign out
    </DropdownMenuItem>

  );
};

export default SignOutItem;
