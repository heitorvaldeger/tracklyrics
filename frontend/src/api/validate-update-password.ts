import { api } from "@/lib/axios";

interface ValidateUpdatePasswordBody {
  codeOTP: string;
}

export const validateUpdatePassword = async ({
  codeOTP,
}: ValidateUpdatePasswordBody) => {
  return await api.patch("/user/validate-update-password", {
    codeOTP,
  });
};
