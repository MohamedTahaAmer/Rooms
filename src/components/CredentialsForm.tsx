"use client";

import { signIn } from "next-auth/react";
import { useRef, useState } from "react";
import { Button } from "./ui/Button";
import { useToast } from "@/hooks/use-toast";

const CredentialsForm = () => {
  const { toast } = useToast();
  const formRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const name = target.elements.name.value;
    const password = target.elements.password.value;
    const formValues = { name, password };

    try {
      // await fetch("/api/register", {
      //   method: "POST",
      //   body: JSON.stringify(formValues),
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      signIn("credentials",{ callbackUrl: "/" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "There was an error logging you in.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      formRef.current.reset();
    }
  };

  const input_style =
    "block w-full px-4 py-3 text-sm font-normal text-gray-700 bg-white bg-clip-padding border  border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";

  return (
    <div className="border  rounded-xl p-5 bg-slate-400 border-gray-300">
      <form ref={formRef} onSubmit={onSubmit}>
        <div className="mb-6">
          <input
            required
            type="name"
            name="name"
            placeholder="Name"
            className={`${input_style}`}
          />
        </div>
        <div className="mb-6">
          <input
            required
            type="password"
            name="password"
            placeholder="Password"
            className={`${input_style}`}
          />
        </div>
        <Button
          isLoading={isLoading}
          type="submit"
          size="sm"
          style={{ backgroundColor: `${isLoading ? "#ccc" : "#3446eb"}` }}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "isLoading..." : "Sign Up"}
        </Button>
      </form>
    </div>
  );
};

export default CredentialsForm;
