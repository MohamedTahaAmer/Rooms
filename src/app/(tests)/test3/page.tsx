"use client";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <div className="text-2xl font-medium">
      Not Protected
      <button
        onClick={() => {
          router.push("/");
        }}
      >
        home
      </button>
    </div>
  );
};

export default Page;
