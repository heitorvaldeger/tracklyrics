import { Outlet, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export const DefaultLayout = () => {
  const navigate = useNavigate()

  return (
    <div className="w-full min-h-screen flex flex-col mx-auto relative">
      <Header>
        <div className="w-full flex justify-end items-center gap-2 mx-2">
          <Button variant="outline" onClick={() => navigate("/login")}>Sign In</Button>
          <Button className="bg-teal-500 hover:bg-teal-800 font-medium" onClick={() => navigate("/register")}>Get Started</Button>
        </div>
      </Header>
      <div className="w-3/5 2xl:w-2/4 mx-auto pt-4 pb-40">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}