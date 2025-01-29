import { useNavigate } from "react-router"

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
import googleIcon from "@/assets/images/google-icon.svg"
import facebookIcon from "@/assets/images/facebook-icon.svg"
import { BackToHomeButton } from "@/components/BackToHomeButton"

export const LoginView = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-white h-screen flex justify-center items-center">
      <div>
        <BackToHomeButton />
        <Card className="w-[450px] mx-2 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-center text-xl tracking-normal">Sign in to your account</CardTitle>
          </CardHeader>
          <CardContent className="py-0 px-6">
            <form>
              <div className="grid grid-cols-2 w-full gap-4">
                <div className="flex flex-col space-y-0.5">
                  <Button tabIndex={1} variant="outline" className="rounded-3xl shadow-none">
                    <img src={googleIcon} alt="Google Icon" width={18} height={18} />
                    Sign in with google
                  </Button>
                </div>
                <div className="flex flex-col space-y-0.5">
                  <Button tabIndex={2} variant="outline" className="rounded-3xl shadow-none">
                    <img src={facebookIcon} alt="Facebook Icon" width={18} height={18} />
                    Sign in with facebook
                  </Button>
                </div>
              </div>

              <div className="py-4">
                <div className="grid w-full gap-4 my-3">
                  <div className="flex flex-col space-y-0.5">
                    <Label htmlFor="emailAddress" className="font-semibold">Your e-mail address</Label>
                    <Input type="email" tabIndex={3} id="emailAddress" />
                  </div>
                </div>
                <div className="grid w-full gap-4 my-3">
                  <div className="flex flex-col space-y-0.5">
                    <Label htmlFor="password" className="font-semibold">Password</Label>
                    <Input type="password" tabIndex={4} id="password" />
                    <Button tabIndex={6} variant="link" className="text-xs justify-end px-0">Forgot your password?</Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="block">
            <Button tabIndex={6} className="w-full bg-teal-500 hover:bg-teal-800 font-bold">Sign in</Button>

            <div className="my-2">
              <Label htmlFor="userName" className="text-xs">
                Don't have an account?
              </Label>
              <Button tabIndex={7} variant="link" className="font-bold text-xs px-1" onClick={() => navigate("/register")}>Register here</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}