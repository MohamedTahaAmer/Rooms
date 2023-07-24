import { User } from "next-auth";
import { FC } from "react";
import { DropdownMenuTrigger, DropdownMenu } from "./ui/DropdownMenu";
import UserAvatar from "./UserAvatar";

interface UserAccountNavProps {
  user: Pick<User, "name" | "image" | "email">;
}

const UserAccountNav: FC<UserAccountNavProps> = ({user}) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {/* // - although in the UserAvatar we  are defining the user to have only the name and image, but we can send the hole user object form here, and there inside the UserAvatar if we tried to access user.email we won't get an error, we will just get a squeggly line under the .email */}
          <UserAvatar user={{name: user?.name, image: user?.image}}/>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </div>
  );
};

export default UserAccountNav;
