import CBLink from "@/components/CBLink";
import { toast } from "@/hooks/use-toast";

export const useCustomToasts = () => {
  const loginToast = (title: string) => {
    const { dismiss } = toast({
      title,
      description: "You need to be logged in to do that.",
      variant: "destructive",
      action: (
        <div onClick={() => dismiss()}>
          <CBLink href="/sign-in" variant="outline" text="Login" />
        </div>
      ),
    });
  };

  return { loginToast };
};
