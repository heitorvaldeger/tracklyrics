import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query"
import { handleAxiosError } from "@/lib/utils";
import { registerService } from "@/services/auth-service";
import { vineResolver } from "@hookform/resolvers/vine";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { InferInput } from "@vinejs/vine/types"
import vine from "@vinejs/vine";
import { Register } from "@/models/register";

const registerAuthValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(6).confirmed(),
    username: vine.string().trim().minLength(4),
    firstName: vine.string().trim().minLength(1),
    lastName: vine.string().trim().minLength(1),
  })
)

type CreateNewAccountData = InferInput<typeof registerAuthValidator> & {
  password_confirmation: string
}

export const useRegisterViewModel = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: (account: Register) => registerService(account),
    onError: (error: Error) => {
      const { message } = handleAxiosError(error, form)
      toast({
        description: message,
        variant: "destructive",
      })
    }
  })

  const form = useForm<CreateNewAccountData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    resolver: vineResolver(registerAuthValidator),
    shouldUnregister: false
  });

  const handleCreateNewAccount = async (account: CreateNewAccountData) => {
    mutate({
      ...account,
      password_confirmation: account.password
    })
  };

  return {
    navigate,
    form,
    handleCreateNewAccount,
    isPending
  }
}