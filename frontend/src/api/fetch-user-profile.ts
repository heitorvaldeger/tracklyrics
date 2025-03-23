import { api } from "@/lib/axios";
import { User } from "@/models/user";

export const fetchUserProfile = async () => {
  return (await api.get<User>("/user")).data;
};
