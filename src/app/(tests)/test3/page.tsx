"use client";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  // const router = useRouter();
  const [test, setTest] = useState(true);
  const button = (
    <button
      onClick={() => setTest((prev) => !prev)}
      className={cn(
        buttonVariants(),
        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      )}
      // onClick={() => {
      //   router.push("/");
      // }}
    >
      home
    </button>
  );
  if (test) {
    return <div>test {button}</div>;
  } else {
    return <div className="text-2xl font-medium">Not Protected {button}</div>;
  }
};

export default Page;
