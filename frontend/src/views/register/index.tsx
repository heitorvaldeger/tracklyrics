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

export const RegisterView = () => {
  return (
    <div className="bg-gray-100 h-screen flex justify-center items-center">
      <Card className="w-[450px] mx-2 rounded-3xl">
        <CardHeader>
          <CardTitle className="text-center text-xl tracking-normal font-extrabold">Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid grid-cols-2 w-full gap-4 my-3">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="firstName" className="font-bold">First name</Label>
                <Input tabIndex={1} id="firstName"/>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="lastName" className="font-bold">Last name</Label>
                <Input tabIndex={2} id="lastName"/>
              </div>
            </div>

            <div className="grid w-full gap-4 my-3">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="userName" className="font-bold">Username</Label>
                <Input tabIndex={3} id="userName"/>
              </div>
            </div>
            <div className="grid w-full gap-4 my-3">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="emailAddress" className="font-bold">Your e-mail address</Label>
                <Input type="email" tabIndex={4} id="emailAddress"/>
              </div>
            </div>
            <div className="grid w-full gap-4 my-3">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password" className="font-bold">Password</Label>
                <Input type="password" tabIndex={5} id="password"/>
              </div>
            </div>
            <div className="grid w-full gap-4 my-3">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirmPassword" className="font-bold">Confirm password</Label>
                <Input type="password" tabIndex={6} id="confirmPassword"/>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="block">
          <Button tabIndex={7} className="w-full bg-teal-500 hover:bg-teal-800">Register</Button>

          <div className="py-2">
            <Label htmlFor="userName" className="text-xs">
              Already have an account?
            </Label>
            <a href="#" tabIndex={8} className="mx-1"><Label className="text-xs hover:cursor-pointer hover:underline font-bold">Login Here</Label></a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}