import { api } from "@/lib/axios";

export interface UpdatePasswordBody {
  password: string;
}

export const updatePassword = async ({ password }: UpdatePasswordBody) => {
  await api.patch(`/user/update-password`, {
    password,
  });
};
