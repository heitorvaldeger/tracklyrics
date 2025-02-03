import { Outlet, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { AppBar } from "@/components/AppBar"
import { AppFooter } from "@/components/AppFooter"

export const DefaultLayout = () => {
  const navigate = useNavigate()

  return (
    <>
      <AppBar>
        <div className="w-full flex justify-end items-center gap-2 mx-2">
          <Button variant="outline" onClick={() => navigate("/login")}>Sign In</Button>
          <Button className="bg-teal-500 hover:bg-teal-800 font-medium" onClick={() => navigate("/register")}>Get Started</Button>
        </div>
      </AppBar>
      <div className="w-3/5 2xl:w-2/4 mx-auto">
        <Outlet />
      </div>
      <AppFooter />
    </>
  )
}