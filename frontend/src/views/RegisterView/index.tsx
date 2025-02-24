import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackToHomeButton } from "@/components/BackToHomeButton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRegister } from "@/hooks/use-register";

export const RegisterView = () => {
  const { navigate, form, handleCreateNewAccount, isLoading } = useRegister();

  return (
    <div className="bg-white h-screen flex justify-center flex-col w-[450px] mx-auto">
      <BackToHomeButton />
      <Card className="rounded-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateNewAccount)}>
            <CardHeader>
              <CardTitle className="text-center text-xl tracking-normal">Create an account</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="grid grid-cols-2 w-full gap-4">
                <div className="flex flex-col space-y-0.5">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">First name</FormLabel>
                        <FormControl>
                          <Input tabIndex={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-0.5">
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Last name</FormLabel>
                        <FormControl>
                          <Input tabIndex={2} {...field} />
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
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Username</FormLabel>
                        <FormControl>
                          <Input tabIndex={3} {...field} />
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">E-mail address</FormLabel>
                        <FormControl>
                          <Input type="email" tabIndex={4} {...field} />
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
                          <Input type="password" tabIndex={5} {...field} />
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
                    name="password_confirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" tabIndex={6} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-1">
              <Button type="submit" tabIndex={7} disabled={isLoading} className="w-full bg-teal-500 hover:bg-teal-800 font-bold">
                {isLoading ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Register"}
              </Button>

              <div className="flex items-center">
                <Label className="text-xs">Already have an account?</Label>
                <Button type="button" tabIndex={8} variant="link" className="font-bold text-xs px-1" onClick={() => navigate("/login")}>
                  Login here
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};
