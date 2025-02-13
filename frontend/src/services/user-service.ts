import { API } from "./api";

export const UserService = {
  getUserFullInfo: async (url: string, token: string) => {
    console.log(url)
    const response = await API.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  }
}