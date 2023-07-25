"use client";

import { FC } from "react";
import { Button } from "./ui/Button";
import { signOut } from "next-auth/react";

interface SignOutProps {}

const SignOut: FC<SignOutProps> = ({}) => {
  return (
    <div>
      <Button onClick={() => signOut()}>sign out</Button>
    </div>
  );
};

export default SignOut;
