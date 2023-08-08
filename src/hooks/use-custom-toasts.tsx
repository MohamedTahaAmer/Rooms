import { buttonVariants } from "@/components/ui/Button";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

export const useCustomToasts = () => {
  const loginToast = (title : string) => {
    const { dismiss } = toast({
      title,
      description: "You need to be logged in to do that.",
      variant: "destructive",
      action: (
        <Link
          onClick={() => dismiss()}
          href="/sign-in"
          className={buttonVariants({ variant: "outline" })}
        >
          Login
        </Link>
      ),
    });
  };

  return { loginToast };
};
