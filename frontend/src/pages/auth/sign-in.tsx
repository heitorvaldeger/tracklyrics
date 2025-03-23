import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import { vineResolver } from "@hookform/resolvers/vine";
import vine from "@vinejs/vine";
import { InferInput } from "@vinejs/vine/types";

import { signIn } from "@/api/sign-in";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const signInFormSchema = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(6),
  }),
);

type SignInForm = InferInput<typeof signInFormSchema>;

export const SignIn = () => {
  const navigate = useNavigate();

  const form = useForm<SignInForm>({
    resolver: vineResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit, control } = form;

  const queryClient = useQueryClient();
  const { mutateAsync: authenticate, isLoading } = useMutation({
    mutationFn: signIn,
  });

  const handleSignIn = async (data: SignInForm) => {
    try {
      await authenticate(data);
      queryClient.invalidateQueries({ queryKey: ["session"] });
      navigate("/", { replace: true });
    } catch (error) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="mx-auto flex h-screen w-[450px] flex-col justify-center gap-4 px-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(handleSignIn)}>
          <Card>
            <CardHeader className="justify-center text-center">
              <CardTitle className="text-xl tracking-normal">
                Welcome back
              </CardTitle>
              <CardDescription>
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid w-full gap-4">
                <div className="flex flex-col space-y-0.5">
                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email" className="font-semibold">
                          E-mail address
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            autoComplete="on"
                            {...field}
                          />
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
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="password" className="font-semibold">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            {...field}
                            required
                            placeholder="••••••••"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Link className="pt-1 text-end text-xs" to="/">
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-2">
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full font-bold"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  "Sign in"
                )}
              </Button>

              <span className="text-xs">OR</span>

              <Button
                type="submit"
                variant="outline"
                className="text-muted-foreground w-full font-bold"
              >
                Continue with Google
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <div className="flex items-center justify-center">
        <Label htmlFor="userName" className="text-xs">
          Don't have an account?
        </Label>
        <Link
          className="px-1 text-xs font-bold underline-offset-4 hover:underline"
          to="/register"
        >
          Register here
        </Link>
      </div>
    </div>
  );
};
