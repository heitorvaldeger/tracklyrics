import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import googleIcon from "@/assets/images/google-icon.svg";
import facebookIcon from "@/assets/images/facebook-icon.svg";
import { BackToHomeButton } from "@/components/BackToHomeButton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLogin } from "@/hooks/use-login";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const LoginView = () => {
  const { form, handleLogin, navigate, isLoading } = useLogin();

  return (
    <div className="bg-white h-screen flex justify-center flex-col w-[450px] mx-auto px-4">
      <BackToHomeButton />
      <Card className="rounded-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)}>
            <CardHeader>
              <CardTitle className="text-center text-xl tracking-normal">Sign in to your account</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
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

              <div className="grid w-full gap-4">
                <div className="flex flex-col space-y-0.5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">E-mail address</FormLabel>
                        <FormControl>
                          <Input type="email" tabIndex={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid w-full gap-4">
                <div className="flex flex-col space-y-0.5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Password</FormLabel>
                        <FormControl>
                          <Input type="password" tabIndex={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button tabIndex={6} variant="link" className="text-xs justify-end px-0">
                    Forgot your password?
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-1">
              <Button type="submit" tabIndex={6} className="w-full bg-teal-500 hover:bg-teal-800 font-bold">
                {isLoading ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Sign In"}
              </Button>

              <div className="flex items-center">
                <Label htmlFor="userName" className="text-xs">
                  Don't have an account?
                </Label>
                <Button tabIndex={7} variant="link" className="font-bold text-xs px-1" onClick={() => navigate("/register")}>
                  Register here
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};
