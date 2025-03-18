import { Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "sonner";

import { deleteVideo } from "@/api/delete-video";
import { fetchLyrics } from "@/api/fetch-lyrics";
import { CardVideo } from "@/components/cards/card-video";
import { Button } from "@/components/ui/button";
import { Video } from "@/models/video";

export const UserLyrics = () => {
  const queryClient = useQueryClient();

  const { data: videos } = useQuery({
    queryKey: ["lyrics"],
    queryFn: async () =>
      await toast
        .promise(fetchLyrics, {
          loading: "Loading data..",
        })
        .unwrap(),
    onError: () => {
      toast.error("Sorry, an error occurred!");
    },
  });

  const { mutateAsync: deleteVideoFn } = useMutation({
    mutationFn: deleteVideo,
    onSuccess(_, newData) {
      const cached = queryClient.getQueryData<Video[]>(["lyrics"]);
      if (cached) {
        queryClient.setQueryData<Video[]>(
          ["lyrics"],
          [...cached.filter((item) => item.uuid !== newData.videoUuid)],
        );
      }
    },
  });

  const handleDeleteLyric = async (videoUuid: string) => {
    toast.promise(deleteVideoFn({ videoUuid }), {
      loading: "Removing video...",
      success: "Video removed with success!",
      error: "Sorry, an error occurred! Try again!",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <p className="text-2xl font-semibold text-center md:text-left">
          Here's your lyrics uploaded
        </p>
        <Button className="bg-muted-foreground hover:bg-primary">
          <Plus size={18} />
          Add Lyrics
        </Button>
      </div>

      <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 place-items-center md:place-items-start">
        {videos?.map((video) => (
          <CardVideo
            key={video.uuid}
            video={video}
            onDelete={() => handleDeleteLyric(video.uuid)}
            onEdit={() => {}}
          />
        ))}
      </div>
    </div>
  );
};
