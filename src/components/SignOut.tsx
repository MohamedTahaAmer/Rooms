"use client";

import { FC} from "react";
import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "./ui/DropdownMenu";

interface SignOutProps {}

const SignOut: FC<SignOutProps> = ({}) => {
  return (
    <DropdownMenuItem
      className="cursor-pointer"
      // - this onSelect isn't a natvie html event, it's an event implemented by Radix-UI and this event.preventDefault() will prevent the menu form closing when click on this item
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
