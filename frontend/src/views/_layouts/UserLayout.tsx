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
import { useUserAuth } from "@/contexts/UserAuthContext"

export const UserLayout = () => {
  const navigate = useNavigate()
  const { logoutUser } = useUserAuth()

  const handleLogoutUser = () => {
    logoutUser()
    navigate("/")
  }

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
              <DropdownMenuItem onClick={() => navigate("/profile")}>My Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/lyrics")}>My Lyrics</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/favorites")}>My Favorites</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogoutUser}>Log Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </AppBar>
      <div className="w-3/4 px-2 md:px-0 md:w-3/5 2xl:w-2/4 mx-auto py-6 flex-1">
        <Outlet />
      </div>
      <AppFooter />
    </>
  )
}