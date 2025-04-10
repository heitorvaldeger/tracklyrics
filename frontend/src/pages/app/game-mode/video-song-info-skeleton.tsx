import { Globe, Trophy, Volume2 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

export const VideoSongInfoSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-video w-full">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold">
            <Skeleton className="h-3 w-30" />
          </h2>
        </div>
        <div className="text-muted-foreground">
          <Skeleton className="h-3 w-40" />
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>Language</span>
            </span>
            <Skeleton className="h-3 w-20" />
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <span>Duration</span>
            </span>
            <span>
              <Skeleton className="h-3 w-20" />
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span>Plays</span>
            </span>
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
};
