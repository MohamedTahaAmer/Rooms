import { Icons } from "@/components/Icons";
import UserAuthForm from "@/components/UserAuthForm";
import { getProviders } from "next-auth/react";
import Link from "next/link";
import CredentialsForm from "./CredentialsForm";

const SignIn = async () => {
  const providers = await getProviders();
  const job:'sign-in'= 'sign-in';


  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you are setting up a Breadit account and agree to our
          User Agreement and Privacy Policy.
        </p>
      </div>
      {/* 
      // >(0:41) if you want to add activity in a server componet like a button that listens to onClick then you can make a new client component for that button and then import it here inside thsi server component
      */}
      <CredentialsForm job={job}/>

      {providers &&
        true &&
        Object.values(providers).filter(provider=>provider.type === 'oauth').map((provider) => (
          <UserAuthForm key={provider.id} provider={provider} />
        ))}

      <p className="px-8 text-center text-sm text-muted-foreground">
        New to Breaddit?{" "}
        <Link
          href="/sign-up"
          className="hover:text-brand text-sm underline underline-offset-4"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
