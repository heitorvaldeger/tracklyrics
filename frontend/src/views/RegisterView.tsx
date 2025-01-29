import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router"
import { BackToHomeButton } from "@/components/BackToHomeButton"

export const RegisterView = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-white h-screen flex justify-center items-center">
      <div>
        <BackToHomeButton />
        <Card className="w-[450px] mx-2 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-center text-xl tracking-normal">Create an account</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid grid-cols-2 w-full gap-4 my-5">
                <div className="flex flex-col space-y-0.5">
                  <Label htmlFor="firstName" className="font-semibold">First name</Label>
                  <Input tabIndex={1} id="firstName" />
                </div>
                <div className="flex flex-col space-y-0.5">
                  <Label htmlFor="lastName" className="font-semibold">Last name</Label>
                  <Input tabIndex={2} id="lastName" />
                </div>
              </div>

              <div className="grid w-full gap-4 my-5">
                <div className="flex flex-col space-y-0.5">
                  <Label htmlFor="userName" className="font-semibold">Username</Label>
                  <Input tabIndex={3} id="userName" />
                </div>
              </div>
              <div className="grid w-full gap-4 my-5">
                <div className="flex flex-col space-y-0.5">
                  <Label htmlFor="emailAddress" className="font-semibold">Your e-mail address</Label>
                  <Input type="email" tabIndex={4} id="emailAddress" />
                </div>
              </div>
              <div className="grid w-full gap-4 my-5">
                <div className="flex flex-col space-y-0.5">
                  <Label htmlFor="password" className="font-semibold">Password</Label>
                  <Input type="password" tabIndex={5} id="password" />
                </div>
              </div>
              <div className="grid w-full gap-4 my-5">
                <div className="flex flex-col space-y-0.5">
                  <Label htmlFor="confirmPassword" className="font-semibold">Confirm password</Label>
                  <Input type="password" tabIndex={6} id="confirmPassword" />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="block">
            <Button tabIndex={7} className="w-full bg-teal-500 hover:bg-teal-800 font-bold">Register</Button>

            <div className="py-2">
              <Label htmlFor="userName" className="text-xs">
                Already have an account?
              </Label>
              <Button tabIndex={8} variant="link" className="font-bold text-xs px-1" onClick={() => navigate("/login")}>Login here</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}