"use client";

import { Play } from "lucide-react";
import { useQuery } from "react-query";
import { useParams } from "react-router";

import { fetchGameModes } from "@/api/fetch-game-modes";
import { fetchVideo } from "@/api/fetch-video";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { ModeCards } from "./game-mode-selection";
import { ModeCardsSkeleton } from "./game-mode-selection-skeleton";
import { VideoSongInfo } from "./video-song-info";
import { VideoSongInfoSkeleton } from "./video-song-info-skeleton";

export default function GameMode() {
  const { videoUuid } = useParams();

  const { data: modes } = useQuery({
    queryFn: () => fetchGameModes({ videoUuid: videoUuid ?? "" }),
    queryKey: ["game-mode", videoUuid],
    enabled: !!videoUuid,
    retry: 0,
  });

  const { data: video } = useQuery({
    queryFn: () => fetchVideo({ uuid: videoUuid ?? "" }),
    queryKey: ["video", videoUuid],
    enabled: !!videoUuid,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  return (
    <div className="max-h-screen mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
      {/* Left column - Video and song info */}
      <div className="w-full md:w-2/5">
        {!video ? <VideoSongInfoSkeleton /> : <VideoSongInfo video={video} />}
      </div>

      {/* Right column - Game mode selection */}
      <div className="w-full md:w-3/5">
        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Select Game Mode</h2>
            <p className="text-muted-foreground mb-6">
              Choose a difficulty level that matches your familiarity with the
              song and language skills.
            </p>

            {!modes ? <ModeCardsSkeleton /> : <ModeCards modes={modes} />}

            <Button
              size="lg"
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700"
            >
              <Play className="mr-2 h-4 w-4" />
              Start Game
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
