import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import { vineResolver } from "@hookform/resolvers/vine";
import vine from "@vinejs/vine";
import { InferInput } from "@vinejs/vine/types";

import { register } from "@/api/register";
import { validateEmail } from "@/api/validate-email";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
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

const validateEmailFormSchema = vine.compile(
  vine.object({
    codeOTP: vine.number(),
  }),
);

type ValidateEmailData = InferInput<typeof validateEmailFormSchema> & {
  email: string;
};

export const Register = () => {
  const navigate = useNavigate();
  const [isOpenValidateEmailModal, setIsOpenValidateModal] = useState(false);
  const registerForm = useForm<CreateNewAccountData>({
    resolver: vineResolver(registerFormSchema),
  });
  const { mutateAsync: createNewAccount, isLoading: isCreatingNewAccount } =
    useMutation({
      mutationFn: register,
    });

  const validateEmailForm = useForm<ValidateEmailData>({
    resolver: vineResolver(validateEmailFormSchema),
  });
  const { mutateAsync: validateEmailFn, isLoading: isValidatingEmail } =
    useMutation({
      mutationFn: validateEmail,
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
      setIsOpenValidateModal(true);
    } catch (error) {
      toast.error("Sorry, an error occurred");
      console.log(error);
    }
  };

  const handleValidateEmail = async ({ codeOTP }: ValidateEmailData) => {
    try {
      const email = registerForm.getValues("email");
      if (!email) {
        toast.error("Whoops, an e-mail must be defined");
        return;
      }

      await validateEmailFn({
        email,
        codeOTP: codeOTP.toString(),
      });

      toast.info("E-mail validated with success. You can do sign-in now!", {
        action: {
          label: "Go to sign-in",
          onClick: () => navigate("/sign-in"),
        },
        duration: 7000,
      });
      setIsOpenValidateModal(false);
      validateEmailForm.reset();
      registerForm.reset();
    } catch (error) {
      toast.error("Sorry, an error occurred");
      console.log(error);
    }
  };

  return (
    <div className="mx-auto flex h-screen w-[450px] flex-col justify-center gap-4 bg-white">
      <Card>
        <Form {...registerForm}>
          <form
            onSubmit={registerForm.handleSubmit(handleCreateNewAccount)}
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
                    control={registerForm.control}
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
                    control={registerForm.control}
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
                    control={registerForm.control}
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
                    control={registerForm.control}
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
                    control={registerForm.control}
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
                    control={registerForm.control}
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
                disabled={isCreatingNewAccount}
                className="w-full font-bold"
              >
                {isCreatingNewAccount ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Register"
                )}
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

      <Dialog open={isOpenValidateEmailModal}>
        <Form {...validateEmailForm}>
          <DialogContent>
            <form
              onSubmit={validateEmailForm.handleSubmit(handleValidateEmail)}
            >
              <DialogTitle>Validate email</DialogTitle>
              <DialogDescription>
                Please, check your e-mail box and set the code
              </DialogDescription>

              <div className="flex justify-center items-center py-4">
                <FormField
                  control={validateEmailForm.control}
                  name="codeOTP"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-semibold">Code</FormLabel>
                      <FormControl>
                        <Input
                          required
                          className="w-full"
                          maxLength={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isValidatingEmail}>
                  {isValidatingEmail ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Validate"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Form>
      </Dialog>
    </div>
  );
};
