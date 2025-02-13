import toast from "react-hot-toast"
import { vineResolver } from "@hookform/resolvers/vine";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { InferInput } from "@vinejs/vine/types"
import vine from "@vinejs/vine";
import { AuthService } from "@/services/auth-service";
import { useState } from "react";
import { ErrorAPI } from "@/lib/error-api";

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

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CreateNewAccountData>({
    resolver: vineResolver(registerAuthValidator),
    shouldUnregister: false
  });

  const handleCreateNewAccount = async (account: CreateNewAccountData) => {
    setIsLoading(true)
    await AuthService.registerService({
      ...account,
      password_confirmation: account.password
    })
      .catch(error => {
        if (error instanceof ErrorAPI) {
          toast.error(error.message)
        }
        console.log(error)
      })
      .finally(() => setIsLoading(false))
  };

  return {
    navigate,
    form,
    handleCreateNewAccount,
    isLoading
  }
}