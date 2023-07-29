"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import { FC } from "react";

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  const { data: session } = useSession({
    // - this required prevents the useSession from returning null, it make it execute this onUnauthenticated
    required: true,
    onUnauthenticated() {
      redirect(`/sign-in?callbackUrl=/test2`);
    },
  });
  return (
    <div>
      Protected Client
      <div className="mx-auto w-fit text-2xl font-bold">
        {session?.user.name}
      </div>
    </div>
  );
};

export default Page;
