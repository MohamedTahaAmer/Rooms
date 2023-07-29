"use client";

import { FC} from "react";
import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "./ui/DropdownMenu";

interface SignOutProps {}

const SignOut: FC<SignOutProps> = ({}) => {
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

export default SignOut;
