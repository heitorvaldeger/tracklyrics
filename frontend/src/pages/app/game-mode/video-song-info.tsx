import { Globe, Heart, Trophy, Volume2 } from "lucide-react";
import { useState } from "react";
import ReactPlayer from "react-player";
import { useMutation } from "react-query";
import { toast } from "sonner";

import { addFavorite } from "@/api/add-favorite";
import { deleteFavorite } from "@/api/delete-favorite";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/session-context";
import { formatTime } from "@/lib/utils";
import { Video } from "@/models/video";

interface VideoSongInfoProps {
  video: Video;
}
export const VideoSongInfo = ({ video }: VideoSongInfoProps) => {
  const [duration, setDuration] = useState(0);
  const [isFavorite, setIsFavorite] = useState(video.isFavorite ?? false);

  const { hasSession } = useSession();
  const { mutateAsync: addFavoriteFn } = useMutation({
    mutationFn: addFavorite,
  });

  const { mutateAsync: deleteFavoriteFn } = useMutation({
    mutationFn: deleteFavorite,
  });

  // Toggle favorite status
  const toggleFavorite = () => {
    if (!hasSession) {
      toast.info("Please, sign in the account to favorite this video!");
      return;
    }
    if (isFavorite && video.uuid) {
      deleteFavoriteFn({ videoUuid: video.uuid });
      setIsFavorite(!isFavorite);
    }

    if (!isFavorite && video.uuid) {
      addFavoriteFn({ videoUuid: video.uuid });
      setIsFavorite(!isFavorite);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-video w-full bg-black">
        <ReactPlayer
          url={video?.linkYoutube}
          width="100%"
          height="100%"
          onReady={(p) => setDuration(p.getDuration())}
        />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold">{video?.title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFavorite}
            className={`${isFavorite ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-gray-900"}`}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart fill={`${isFavorite ? "currentColor" : "none"}`} />
          </Button>
        </div>
        <p className="text-muted-foreground">{video?.artist}</p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>Language</span>
            </span>
            <Badge variant="outline">{video?.language}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <span>Duration</span>
            </span>
            <span>{formatTime(duration, false)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span>Plays</span>
            </span>
            <span>{video?.qtyViews ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
