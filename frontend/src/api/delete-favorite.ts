import { api } from "@/lib/axios";

interface DeleteFavoriteBody {
  videoUuid: string;
}
export const deleteFavorite = async ({ videoUuid }: DeleteFavoriteBody) => {
  await api.delete(`/favorites/${videoUuid}`);
};
