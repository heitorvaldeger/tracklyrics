import { vineResolver } from "@hookform/resolvers/vine";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { InferInput } from "@vinejs/vine/types"
import vine from "@vinejs/vine";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { AuthService } from "@/services/auth-service";
import { useState } from "react";
import { ErrorAPI } from "@/lib/error-api";
import toast from "react-hot-toast";

const loginValidationSchema = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(6)
  })
);

type LoginFormData = InferInput<typeof loginValidationSchema>

export const useLoginViewModel = () => {
  const navigate = useNavigate();
  const { loginUser } = useUserAuth()

  const [isLoading, setIsLoading] = useState(false)
  // const { mutate, isPending } = useMutation({
  //   mutationFn: ({ email, password }: Login) => AuthService.loginService({ email, password }),
  //   onSuccess: (credential) => {
  //     loginUser(credential.token)
  //     navigate("/")
  //   },
  //   onError: (error: Error) => {
  //     if (error instanceof AxiosError) {
  //       const { status, response } = error;
  //       if (status === HttpStatusCode.BadRequest) {
  //         const apiErrors = response?.data
  //         apiErrors.forEach((apiError: any) => form.setError(apiError.field, {
  //           type: "custom",
  //           message: apiError.message
  //         }))
  //       }

  //       toast.error(`Erro ${status}: ${APIErrors[status ?? 0]}`)

  //     } else {
  //       console.log(error)
  //     }
  //   }
  // })
  
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
    await AuthService.loginService(loginData)
      .then(credential => {
        loginUser(credential.token)
        navigate("/")
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
    handleLogin,
    isLoading
  }
}