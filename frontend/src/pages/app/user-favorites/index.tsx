import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "sonner";

import { deleteFavorite } from "@/api/delete-favorite";
import { fetchFavorites } from "@/api/fetch-favorites";
import { CardVideo } from "@/components/cards/card-video";
import { Video } from "@/models/video";

export const UserFavorites = () => {
  const queryClient = useQueryClient();
  const { data: favorites } = useQuery({
    queryFn: async () =>
      await toast
        .promise(fetchFavorites, {
          loading: "Loading data...",
        })
        .unwrap(),
    queryKey: ["favorites"],
    onError: () => {
      toast.error("Sorry, an error occurred!");
    },
  });

  const { mutateAsync: deleteFavoriteFn } = useMutation({
    mutationFn: deleteFavorite,
    onSuccess(_, newData) {
      const cached = queryClient.getQueryData<Video[]>(["favorites"]);
      if (cached) {
        queryClient.setQueryData<Video[]>(
          ["favorites"],
          [...cached.filter((item) => item.uuid !== newData.videoUuid)],
        );
      }
    },
  });

  const handleDeleteVideoFromFavorites = (videoUuid: string) => {
    toast.promise(deleteFavoriteFn({ videoUuid }), {
      loading: "Removing video...",
      success: "Video removed from your favorites with success!",
      error: "Sorry, an error occurred! Try again!",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-2xl font-semibold text-center md:text-left">
        Here's your favorites
      </p>
      <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 place-items-center md:place-items-start">
        {favorites?.map((favorite) => (
          <CardVideo
            key={favorite.uuid}
            video={favorite}
            onDelete={handleDeleteVideoFromFavorites}
          />
        ))}
      </div>
    </div>
  );
};
