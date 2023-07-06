"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Image as ImageIcon, Link2 } from "lucide-react";
import { FC } from "react";
import { UserAvatar } from "./UserAvatar";
import type { Session } from "next-auth"; // - this session is imported only to difine a TS type
import { usePathname, useRouter } from "next/navigation";

interface MiniCreatePostProps {
  session: Session | null;
}

// >(3:07) it's better to fetch the session on a server component, then send it to the client components, not to have layout shifts like the ones you have in your snippets project
const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <li className="overflow-hidden rounded-md bg-white shadow">
      <div className="h-full px-6 py-4 flex justify-between gap-6">
        <div className="relative">
          <UserAvatar
            user={{
              // >(3:09) if the user doesn't exist thie ? return undefined, but we wann return null if there is no user, so we use this || as it will return the last falsy value if all the values are falsy
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />

          {/* // >(3:09) this is to just display a small circle */}
          <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white" />
        </div>

        {/* // >(3:12) this input is readOnly as it won't read any thing, it will just take the user if clicked on it to the actual create post page */}
        <Input
          onClick={() => router.push(pathname + "/submit")}
          readOnly
          placeholder="Create post"
        />

        <Button
          onClick={() => router.push(pathname + "/submit")}
          variant="ghost"
        >
          <ImageIcon className="text-zinc-600" />
        </Button>
        <Button
          onClick={() => router.push(pathname + "/submit")}
          variant="ghost"
        >
          <Link2 className="text-zinc-600" />
        </Button>
      </div>
    </li>
  );
};

export default MiniCreatePost;
