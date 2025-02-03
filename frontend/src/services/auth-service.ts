import { Login } from "@/models/login"
import { API } from "./api"
import { Credential } from "@/models/credential"
import { Register } from "@/models/register"
import { UserVerificationStatus } from "@/models/user-verification-status"
import { AxiosRequestConfig } from "axios"

export const loginService = async (params: Login, config?: AxiosRequestConfig): Promise<Credential> => {
  const response = await API.post("/login", params, config);
  return response.data;
}

export const registerService = async (params: Register): Promise<UserVerificationStatus> => {
  const response = await API.post("/register", params);
  return response.data;
}