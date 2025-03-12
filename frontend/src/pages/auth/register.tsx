import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link } from "react-router";
import { toast } from "sonner";

import { LoadingOutlined } from "@ant-design/icons";
import { vineResolver } from "@hookform/resolvers/vine";
import vine from "@vinejs/vine";
import { InferInput } from "@vinejs/vine/types";

import { register } from "@/api/register";
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

const registerFormSchema = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(6).confirmed(),
    username: vine.string().trim().minLength(4),
    firstName: vine.string().trim().minLength(1),
    lastName: vine.string().trim().minLength(1),
  }),
);

type CreateNewAccountData = InferInput<typeof registerFormSchema> & {
  password_confirmation: string;
};

export const Register = () => {
  const form = useForm<CreateNewAccountData>({
    resolver: vineResolver(registerFormSchema),
  });

  const { handleSubmit } = form;

  const { mutateAsync: createNewAccount, isLoading } = useMutation({
    mutationFn: register,
  });

  const handleCreateNewAccount = async (data: CreateNewAccountData) => {
    try {
      const dataWithPasswordConfirmation: CreateNewAccountData = {
        ...data,
        password_confirmation: data.password,
      };

      await createNewAccount(dataWithPasswordConfirmation);

      toast.info(
        "A code verification was sended for you e-mail address. Please, check your inbox ou spam e-mail",
        {
          duration: 7000,
        },
      );
    } catch (error) {
      toast.error("Sorry, an error occurred");
      console.log(error);
    }
  };

  return (
    <div className="mx-auto flex h-screen w-[450px] flex-col justify-center gap-4 bg-white">
      <Card>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(handleCreateNewAccount)}
            className="space-y-6"
          >
            <CardHeader className="justify-center text-center">
              <CardTitle className="text-xl tracking-normal">
                Create an account
              </CardTitle>
              <CardDescription>
                Enter your details below to create your account
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="grid w-full grid-cols-2 gap-4">
                <div className="flex flex-col space-y-0.5">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          First name
                        </FormLabel>
                        <FormControl>
                          <Input required {...field} />
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
                        <FormLabel className="font-semibold">
                          Last name
                        </FormLabel>
                        <FormControl>
                          <Input required {...field} />
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
                        <FormLabel className="font-semibold">
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input required {...field} />
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
                        <FormLabel className="font-semibold">
                          E-mail address
                        </FormLabel>
                        <FormControl>
                          <Input required type="email" {...field} />
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
                        <FormLabel className="font-semibold">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input required type="password" {...field} />
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
                        <FormLabel className="font-semibold">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input required type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-1">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full font-bold"
              >
                {isLoading ? <LoadingOutlined /> : "Register"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <div className="flex items-center justify-center">
        <Label className="text-xs">Already have an account?</Label>
        <Link className="px-1 text-xs font-bold" to="/sign-in">
          Login here
        </Link>
      </div>
    </div>
  );
};
