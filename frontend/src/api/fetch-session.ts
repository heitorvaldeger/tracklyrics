import { api } from "@/lib/axios";

interface FetchSessionBody {
  hasSession: boolean;
}

export const fetchSession = async () => {
  return (await api.get<FetchSessionBody>("/session")).data;
};
