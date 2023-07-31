"use client";
import { FC } from "react";

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  return (
    <div>
      Protected Client
      <div className="mx-auto w-fit text-2xl font-bold">
        {/* {session?.user.name } */}
        {'username'}
      </div>
    </div>
  );
};

export default Page;
