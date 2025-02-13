import { ErrorAPI } from "@/lib/error-api";
import axios from "axios"
const API = axios.create({
  baseURL: "http://localhost:3333"
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erros retornados pela API (ex: 400, 401, 422)
      return Promise.reject(ErrorAPI.fromAxiosError(error));
    } else if (error.request) {
      // Erros de rede ou sem resposta do servidor
      return Promise.reject(new ErrorAPI("Sem resposta do servidor", 500));
    } else {
      // Outros erros desconhecidos
      return Promise.reject(new ErrorAPI(error.message, 500));
    }
  }
)

export {
  API
}