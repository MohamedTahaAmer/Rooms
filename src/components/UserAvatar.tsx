import { User } from "next-auth";
import { FC } from "react";
import { Avatar, AvatarFallback } from "./ui/Avatar";
import Image from "next/image";
import { AvatarProps } from "@radix-ui/react-avatar";
import { Icons } from "./Icons";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
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
          <Icons.user aria-label="Unknown User Icon" className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
