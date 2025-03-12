import { Header } from ".";
import { AvatarUser } from "@/components/avatar/avatar-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const HeaderAuthenticated = () => {
  return (
    <Header>
      <div className="flex w-full items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <AvatarUser />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mx-3">
            <DropdownMenuItem>My Profile</DropdownMenuItem>
            <DropdownMenuItem>My Lyrics</DropdownMenuItem>
            <DropdownMenuItem>My Favorites</DropdownMenuItem>
            <DropdownMenuItem>Log Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Header>
  );
};
