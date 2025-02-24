import toast from "react-hot-toast"
import { vineResolver } from "@hookform/resolvers/vine";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { InferInput } from "@vinejs/vine/types"
import vine from "@vinejs/vine";
import { useState } from "react";
import { useAPI } from "@/hooks/use-api";
import { ENDPOINTS } from "@/constants/endpoints";
import { API_METHODS } from "@/constants/api-methods";
import { AxiosError } from "axios";

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

export const useRegister = () => {
  const navigate = useNavigate();
  const { request } = useAPI()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CreateNewAccountData>({
    resolver: vineResolver(registerAuthValidator),
    shouldUnregister: false
  });

  const handleCreateNewAccount = async (account: CreateNewAccountData) => {
    setIsLoading(true)
    await request(API_METHODS.POST, ENDPOINTS.REGISTER, {
      ...account,
      password_confirmation: account.password
    })
      .catch(error => {
        if (error instanceof AxiosError) {
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