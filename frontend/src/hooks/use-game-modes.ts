import useSWR from "swr"
import { ENDPOINTS } from "@/constants/endpoints"
import { useAPI } from "@/hooks/use-api";
import { Video } from "@/models/video";
import { useParams } from "react-router";
import { formatDistanceToNowStrict } from "date-fns";
import { useEffect, useState } from "react";
import { API_METHODS } from "@/constants/api-methods";
import { GameModes } from "@/models/game-modes";

export const useGameModes = () => {
  const { request } = useAPI()
  const { videoUuid } = useParams()
  const { data: video, error: videoError } = 
    useSWR([ENDPOINTS.VIDEOS_WITH_UUID(videoUuid || ""), API_METHODS.GET], ([url, method]) => request<Video>(method, url))
  const { data: modes, error: modesError } =
    useSWR(() => [ENDPOINTS.GAME_MODES_WITH_UUID(video!.uuid), API_METHODS.GET], ([url, method]) => request<GameModes>(method, url))

  const [releaseYearByExtended, setReleaseYearByExtended] = useState("")

  useEffect(() => {
    if (video) {
      setReleaseYearByExtended(formatDistanceToNowStrict(video.releaseYear, {
        addSuffix: true
      }))
    }
  }, [video])

  return {
    releaseYearByExtended,
    video,
    modes,
    error: videoError || modesError
  }
}