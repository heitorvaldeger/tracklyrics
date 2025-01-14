import { Outlet, useNavigate } from "react-router"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AppBar } from "@/components/AppBar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AppFooter } from "@/components/AppFooter"

export const UserLayout = () => {
  const navigate = useNavigate()

  return (
    <>
      <AppBar>
        <div className="w-full flex justify-end items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar className="mx-2 hover:opacity-50 transition-opacity outline outline-2 outline-teal-500">
                <AvatarImage src="https://github.com/heitorvaldeger.png" />
                <AvatarFallback>HA</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mx-3">
              <DropdownMenuItem onClick={() => navigate("/my-profile")}>My Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/lyrics")}>My Lyrics</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/favorites")}>My Favorites</DropdownMenuItem>
              <DropdownMenuItem>Log Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </AppBar>
      <div className="w-3/5 2xl:w-2/4 mx-auto py-6">
        <Outlet />
      </div>
      <AppFooter />
    </>
  )
}