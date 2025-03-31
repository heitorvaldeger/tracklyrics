import { Globe, Trophy, Volume2 } from "lucide-react";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useMutation } from "react-query";

import { addFavorite } from "@/api/add-favorite";
import { deleteFavorite } from "@/api/delete-favorite";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { Video } from "@/models/video";

interface VideoSongInfoProps {
  video: Video;
}
export const VideoSongInfo = ({ video }: VideoSongInfoProps) => {
  const playerRef = useRef<ReactPlayer>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const { mutateAsync: addFavoriteFn } = useMutation({
    mutationFn: addFavorite,
  });

  const { mutateAsync: deleteFavoriteFn } = useMutation({
    mutationFn: deleteFavorite,
  });

  // Toggle favorite status
  const toggleFavorite = () => {
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
          ref={playerRef}
          url={video?.linkYoutube}
          width="100%"
          height="100%"
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
            {isFavorite ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            )}
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
            <span>
              {formatTime(playerRef.current?.getDuration() ?? 0, false)}
            </span>
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
