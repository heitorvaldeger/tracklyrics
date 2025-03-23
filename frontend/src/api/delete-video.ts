import { api } from "@/lib/axios";

interface DeleteVideoBody {
  videoUuid: string;
}
export const deleteVideo = async ({ videoUuid }: DeleteVideoBody) => {
  await api.delete(`/videos/${videoUuid}`);
};
