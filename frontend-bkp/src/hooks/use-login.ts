import { vineResolver } from "@hookform/resolvers/vine";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { InferInput } from "@vinejs/vine/types"
import vine from "@vinejs/vine";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAPI } from "@/hooks/use-api";
import { ENDPOINTS } from "@/constants/endpoints";
import { API_METHODS } from "@/constants/api-methods";
import { Credential } from "@/models/credential";
import { AxiosError } from "axios";

const loginValidationSchema = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(6)
  })
);

type LoginFormData = InferInput<typeof loginValidationSchema>

export const useLogin = () => {
  const navigate = useNavigate();
  const { request } = useAPI()
  const { loginUser } = useUserAuth()

  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<LoginFormData>({
    resolver: vineResolver(loginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    shouldUnregister: false
  });

  const handleLogin = async (loginData: LoginFormData) => {
    setIsLoading(true)
    await request<Credential>(API_METHODS.POST, ENDPOINTS.LOGIN, loginData)
      .then(credential => {
        loginUser(credential.token)
        navigate("/")
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
    handleLogin,
    isLoading
  }
}