import { ENDPOINTS } from "@/constants/endpoints";
import { useUserAuth } from "@/contexts/UserAuthContext";
import axios, { AxiosError, AxiosRequestConfig, HttpStatusCode } from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3333"
})

export const useAPI = () => {
  const { token, logoutUser } = useUserAuth()

  if (token) {
    instance.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  const request = async <T>(
    method: string,
    url: string,
    data?: any,
    configs?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response = await instance.request({
        method, url, data, ...configs
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === HttpStatusCode.Unauthorized) {
        logoutUser();
        window.location.href = ENDPOINTS.LOGIN
      }
      return error as any;
    }
  }

  return {
    request
  }
}