import { api } from "@/lib/axios";

export interface RegisterBody {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export const register = async (body: RegisterBody) => {
  await api.post("/register", body);
};
