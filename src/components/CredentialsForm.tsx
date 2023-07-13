"use client";

import { signIn } from "next-auth/react";
import { useRef, useState } from "react";
import { Button } from "./ui/Button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const CredentialsForm = ({ job }: { job: "sign-in" | "sign-up" }) => {
  const router = useRouter()
  const { toast } = useToast();
  const formRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const SignUp = async function (formValues) {
    try {
      const {data} = await axios.post("/api/register", formValues);
      signIn("credentials", { ...formValues, callbackUrl: "/" })
      router.push(`/`)
  } catch (error) {
      return toast({
        title: "Something went wrong.",
        description: "Cann't Sign you Up",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const username = target.elements.username.value;
    const password = target.elements.password.value;
    const formValues = { username, password };

    try {
      job === "sign-in" &&
        signIn("credentials", { ...formValues, callbackUrl: "/" });
      job === "sign-up" && SignUp(formValues);
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
    <div className="border  rounded-xl p-5 bg-slate-200 border-gray-300">
      <form ref={formRef} onSubmit={onSubmit}>
        <div className="mb-6">
          <input
            required
            type="name"
            name="username"
            placeholder="UserName"
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
          style={{ backgroundColor: `${isLoading ? "#ccc" : "#27272A"}` }}
          className="w-full"
          disabled={isLoading}
        >
          {job === "sign-in" && (isLoading ? "isLoading..." : "Sign In")}
          {job === "sign-up" && (isLoading ? "isLoading..." : "Sign UP")}
        </Button>
      </form>
    </div>
  );
};

export default CredentialsForm;
