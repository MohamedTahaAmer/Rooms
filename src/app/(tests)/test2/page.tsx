"use client";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter()
  return (
    <div>
      Protected Client
      <div className="mx-auto w-fit text-2xl font-bold">
        <button
          className={cn(buttonVariants({ variant: "outline" }), "self-start")}
          onClick={() => {router.push('/')}}
        >
          Trigger
        </button>
      </div>
    </div>
  );
};

export default Page;
