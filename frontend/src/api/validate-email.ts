import { api } from "@/lib/axios";

interface ValidateEmailBody {
  email: string;
  codeOTP: string;
}

export const validateEmail = async ({ email, codeOTP }: ValidateEmailBody) => {
  return await api.post("/validate-email", {
    email,
    codeOTP,
  });
};
