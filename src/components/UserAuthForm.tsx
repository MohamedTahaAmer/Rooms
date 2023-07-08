"use client";
import { signIn } from "next-auth/react";
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "./Icons";

// interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

// >(0:43)
// >(1:21) because here we are working with TS, which requires us to define a type for the component parameters, Josh created a snippet that does that boiler plate for him, like using the extension react snippets for JS
// const UserAuthForm: FC<UserAuthFormProps> = ({ className,providers, ...props }) => {
const UserAuthForm = ({ provider }: { provider: any }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const loginWithProvider = async () => {
    setIsLoading(true);

    try {
      await signIn(provider.id);
    } catch (error) {
      // >(0:50) these components/ui are made by npm packages during installing them
      toast({
        title: "Error",
        description: "There was an error logging in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const iconProvider = (name: string) => {
    const githubIcon = <Icons.github className="h-4 w-4 mr-2 icon" />;
    const googleIcon = <Icons.google className="h-4 w-4 mr-2 icon" />;

    const icon =
      name === "Google" ? googleIcon : 
      name === "GitHub" ? githubIcon : null;
    return icon;
  };

  return (
    <div className="flex justify-center">
      <Button
        // >(0:48)
        isLoading={isLoading}
        type="button"
        size="sm"
        className="w-full"
        onClick={loginWithProvider}
        disabled={isLoading}
      >
        {isLoading ? null : iconProvider(provider.name)}
        {provider.name}
      </Button>
    </div>
  );
};

export default UserAuthForm;
