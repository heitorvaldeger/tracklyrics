import { useMutation, useQueryClient } from "react-query";
import { Link } from "react-router";

import { signOut } from "@/api/sign-out";
import { AvatarUser } from "@/components/avatar/avatar-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Header } from ".";

export const HeaderAuthenticated = () => {
  const qc = useQueryClient();
  const { mutateAsync: signOutFn } = useMutation({
    mutationFn: signOut,
    onSuccess: async () => {
      await qc.invalidateQueries(["session"]);
    },
  });

  return (
    <Header>
      <div className="flex w-full items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
            <AvatarUser />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mx-3">
            <DropdownMenuItem asChild>
              <Link className="cursor-pointer" to="/profile">
                My profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className="cursor-pointer" to="/lyrics">
                My lyrics
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className="cursor-pointer" to="/favorites">
                My favorites
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOutFn()}>
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Header>
  );
};
