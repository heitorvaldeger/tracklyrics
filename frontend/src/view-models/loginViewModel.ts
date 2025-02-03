import { useToast } from "@/hooks/use-toast";
import { handleAxiosError } from "@/lib/utils";
import { loginService } from "@/services/auth-service";
import { vineResolver } from "@hookform/resolvers/vine";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { InferInput } from "@vinejs/vine/types"
import vine from "@vinejs/vine";
import { useMutation } from "@tanstack/react-query";
import { Login } from "@/models/login";
import { useUserAuth } from "@/contexts/UserAuthContext";

const loginValidationSchema = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(6)
  })
);

type LoginFormData = InferInput<typeof loginValidationSchema>

export const useLoginViewModel = () => {
  const { toast } = useToast()
  const navigate = useNavigate();
  const { loginUser } = useUserAuth()
  const { mutate, isPending } = useMutation({
    mutationFn: ({ email, password }: Login) => loginService({ email, password }),
    onSuccess: (credential) => {
      loginUser(credential.token)
      navigate("/")
    },
    onError: (error: Error) => {
      const { message } = handleAxiosError(error, form)
      toast({
        description: message,
        variant: "destructive",
      })
    }
  })
  
  const form = useForm<LoginFormData>({
    resolver: vineResolver(loginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    shouldUnregister: false
  });

  const handleLogin = async ({ email, password }: LoginFormData) => {
    mutate({ email, password })
  };

  return {
    navigate,
    form,
    handleLogin,
    isPending
  }
}