"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/hooks/use-toast";
import { CreateSubredditPayload } from "@/lib/validators/subreddit";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCustomToasts } from "@/hooks/use-custom-toasts";

const Page = () => {
  const { loginToast } = useCustomToasts();
  const router = useRouter();
  const [input, setInput] = useState<string>("");

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      };

      const { data }: { data: { subreddit: string } } = await axios.post(
        "/api/subreddit",
        payload
      );
      return data.subreddit;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          toast({
            title: err.response.data.message,
            description: "Please choose a different name.",
            variant: "destructive",
          });
          return;
        }

        if (err.response?.status === 422) {
          toast({
            title: err.response.data.message,
            description: "Please choose a name between 3 and 21 letters.",
            variant: "destructive",
          });
          return;
        }

        if (err.response?.status === 401) {
          loginToast(err.response.data.message);
          return;
        }

        if (err.response?.status === 500) {
          toast({
            title: err.response.data.message,
            description: "Could not create subreddit.",
            variant: "destructive",
          });
          return;
        }
      }

      toast({
        title: "There was an error.",
        description: "Please Check your internet connection.",
        variant: "destructive",
      });
    },
    onSuccess: (name) => {
      toast({
        title: `${name}.`,
        description: `${name} Subreddit Created Successfully.`,
        variant: "success",
        duration: 2000,
      });
      router.push(`/r/${name}`);
    },
  });

  return (
    <div className="container mx-auto flex h-full max-w-3xl items-center">
      <div className="relative h-fit w-full space-y-6 rounded-lg bg-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Create a Community</h1>
        </div>

        <hr className="h-px bg-red-500" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="pb-2 text-xs">
            Community names including capitalization cannot be changed.
          </p>
          <div className="relative">
            <p className="absolute inset-y-0 left-0 grid w-8 place-items-center text-sm text-zinc-400">
              r/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-6"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            disabled={isLoading}
            variant="subtle"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length < 1}
            onClick={() => createCommunity()}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;