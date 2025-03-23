import { api } from "@/lib/axios";

export interface SignInBody {
  email: string;
  password: string;
}

export const signIn = async (body: SignInBody) => {
  await api.post("/login", body);
};
