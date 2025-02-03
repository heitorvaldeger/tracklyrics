import { AxiosError } from "axios"
import { clsx, type ClassValue } from "clsx"
import { UseFormReturn } from "react-hook-form"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleAxiosError = (error: unknown, form?: UseFormReturn<any, any, undefined>): {
  message: string
  data?: any
} => {
  if (error instanceof AxiosError) {
    const { status, response } = error;

    let message = ""
    if (status === 400 && response?.data && form) {
      message = "Erro 400: Requisição inválida.";
      for (const { field, message } of response.data) {
        form.setError(field, {
          type: "custom",
          message: message as string,
        });
      }
    } else if (status !== 400) {
      message = `Erro ${status}: ${response?.data.message}`
    } else {
      message = `Erro desconhecido: ${status}`
    }

    return {
      message,
      data: response!.data
    }
  }

  return {
    message: `Erro desconhecido: ${error}`
  }
}