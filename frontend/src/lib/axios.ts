import axios from "axios";

import { env } from "@/env";

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (values) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return values;
});
