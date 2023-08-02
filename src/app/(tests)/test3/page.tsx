"use client";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const Page = () => {
  const [test, setTest] = useState(true);
  const button = (
    <button
      onClick={() => setTest((prev) => !prev)}
      className={cn(
        buttonVariants(),
        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      )}
    >
      Testing Git
    </button>
  );
  if (test) {
    return <div>test {button}</div>;
  } else {
    return <div className="text-2xl font-medium">Not Protected {button}</div>;
  }
};

export default Page;
