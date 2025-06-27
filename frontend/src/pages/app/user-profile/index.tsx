import { Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdatePasswordSchemaValidator,
  UpdatePasswordValidatorZod,
  ValidateUpdatePasswordSchemaValidator,
  ValidateUpdatePasswordValidatorZod,
} from "@tracklyrics/validators";

import { fetchUserProfile } from "@/api/fetch-user-profile";
import { updatePassword } from "@/api/update-password";
import { validateUpdatePassword } from "@/api/validate-update-password";
import { AvatarUser } from "@/components/avatar/avatar-user";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";

export const UserProfile = () => {
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isOpenValidatePasswordModal, setIsOpenValidatePasswordModal] =
    useState(false);

  const updatePasswordForm = useForm({
    resolver: zodResolver(UpdatePasswordValidatorZod),
  });

  const validatePasswordForm = useForm<ValidateUpdatePasswordSchemaValidator>({
    resolver: zodResolver(ValidateUpdatePasswordValidatorZod),
  });

  const { handleSubmit, control } = updatePasswordForm;

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserProfile,
    onError: () => {
      toast.error("Sorry, an error occurred!");
    },
  });

  const { mutateAsync: updatePasswordFn } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.info(
        "A code verification was sended for you e-mail address. Please, check your inbox ou spam e-mail",
        {
          duration: 7000,
        },
      );
      setIsOpenValidatePasswordModal(true);
      setIsEditingPassword(!isEditingPassword);
    },
  });

  const {
    mutateAsync: validateUpdatePasswordFn,
    isLoading: isValidatingUpdatePassword,
  } = useMutation({
    mutationFn: validateUpdatePassword,
  });

  const handleUpdatePassword = (data: UpdatePasswordSchemaValidator) => {
    updatePasswordFn({ password: data.password });
  };

  const handleValidateEmail = async ({
    codeOTP,
  }: ValidateUpdatePasswordSchemaValidator) => {
    try {
      await validateUpdatePasswordFn({
        codeOTP: codeOTP.toString(),
      });

      toast.info("Great! Your password was updated with success", {
        duration: 5000,
      });
      setIsOpenValidatePasswordModal(false);
      validatePasswordForm.reset();
      updatePasswordForm.reset();
    } catch (error) {
      toast.error("Sorry, an error occurred");
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="text-2xl font-bold">My Profile</header>
      <div className="border-gray-200 border p-4 flex gap-2 items-center rounded">
        <AvatarUser className="w-16 h-16" />
        <div className={`flex flex-col ${isLoading ? "space-y-4" : null}`}>
          <span className="font-bold text-lg">
            {isLoading ? (
              <Skeleton className="h-3 w-32" />
            ) : (
              `${userProfile?.firstName} ${userProfile?.lastName}`
            )}
          </span>
          <span className="font-light text-xs md:text-sm text-gray-500 opacity-50">
            {isLoading ? <Skeleton className="h-3 w-40" /> : userProfile?.email}
          </span>
        </div>
      </div>

      <div className="border border-gray-200 rounded p-4 flex flex-col gap-3">
        <header className="flex items-center justify-between font-bold">
          Personal Information
          <Button
            variant="outline"
            className="font-bold text-gray-500 opacity-50"
          >
            <Pencil />
            Edit
          </Button>
        </header>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-slate-400 font-bold opacity-50">
              First Name
            </Label>
            <span className="text-slate-500 font-bold text-sm opacity-60">
              {isLoading ? (
                <Skeleton className="h-3 w-16" />
              ) : (
                userProfile?.firstName
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-slate-400 font-bold opacity-50">
              Last Name
            </Label>
            <span className="text-slate-500 font-bold text-sm opacity-60">
              {isLoading ? (
                <Skeleton className="h-3 w-16" />
              ) : (
                userProfile?.lastName
              )}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-slate-400 font-bold opacity-50">
              E-mail
            </Label>
            <span className="text-slate-500 font-bold text-sm opacity-60">
              {isLoading ? (
                <Skeleton className="h-3 w-40" />
              ) : (
                userProfile?.email
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-slate-400 font-bold opacity-50">
              Username
            </Label>
            <span className="text-slate-500 font-bold text-sm opacity-60">
              {isLoading ? (
                <Skeleton className="h-3 w-24" />
              ) : (
                userProfile?.username
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded p-4 flex flex-col gap-3">
        <Form {...updatePasswordForm}>
          <form onSubmit={handleSubmit(handleUpdatePassword)}>
            <header className="flex items-center justify-between font-bold">
              Change Password
              <Button
                variant="outline"
                className="font-bold text-gray-500 opacity-50"
                onClick={() => setIsEditingPassword(!isEditingPassword)}
                type="button"
              >
                <Pencil />
                Edit
              </Button>
            </header>
            <div className="flex flex-col gap-1">
              {!isEditingPassword ? (
                <>
                  <Label className="text-slate-400 font-bold opacity-50">
                    Your Password
                  </Label>
                  <span className="text-slate-500 font-bold text-sm opacity-60">
                    *********
                  </span>
                </>
              ) : (
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your new password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" className="w-3xs" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </form>
        </Form>
      </div>

      <Dialog open={isOpenValidatePasswordModal}>
        <Form {...validatePasswordForm}>
          <DialogContent>
            <form
              onSubmit={validatePasswordForm.handleSubmit(handleValidateEmail)}
            >
              <DialogTitle>Validate update password</DialogTitle>
              <DialogDescription>
                Please, check your e-mail box and set the code
              </DialogDescription>

              <div className="flex justify-center items-center py-4">
                <FormField
                  control={validatePasswordForm.control}
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
                <Button type="submit" disabled={isValidatingUpdatePassword}>
                  {isValidatingUpdatePassword ? (
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
