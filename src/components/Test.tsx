import { User } from "next-auth";
import { FC } from "react";
import { Avatar, AvatarFallback } from "./ui/Avatar";
import Image from "next/image";
import { AvatarProps } from "@radix-ui/react-avatar";
import { Icons } from "./Icons";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

const Test: FC<UserAvatarProps> = ({ user }) => {
  return (
    <Avatar className="rounded-none w-auto"> 
      {user.image ? (
        <Image
          fill
          className="h-4 w-4"
          src={user?.image}
          alt="profile picture"
          referrerPolicy="no-referrer"
        />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
          <div className="relative h-8 w-8 bg-gray-200">
            <Icons.user className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default Test;
