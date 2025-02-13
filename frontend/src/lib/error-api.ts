import { AxiosError } from "axios";

export class ErrorAPI extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.statusCode = statusCode;
  }

  static fromAxiosError(error: AxiosError) {
    const status = error.response?.status || 500;
    const message = (error.response?.data as { message?: string })?.message || "Erro desconhecido";

    return new ErrorAPI(message, status);
  }
}