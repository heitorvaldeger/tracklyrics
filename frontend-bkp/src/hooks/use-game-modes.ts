import useSWR from "swr";
import { ENDPOINTS } from "@/constants/endpoints";
import { useAPI } from "@/hooks/use-api";
import { Video } from "@/models/video";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { API_METHODS } from "@/constants/api-methods";
import { GameModes } from "@/models/game-modes";
import { getDateRelativeFromNowByYear } from "@/lib/utils";
import { AxiosError } from "axios";

export const useGameModes = () => {
  const { request } = useAPI();
  const { videoUuid } = useParams();
  const { data: video } = useSWR([ENDPOINTS.VIDEOS_WITH_UUID(videoUuid || ""), API_METHODS.GET], ([url, method]) => request<Video>(method, url));
  const { data: modes } = useSWR(
    () => [ENDPOINTS.GAME_MODES_WITH_UUID(video!.uuid), API_METHODS.GET],
    ([url, method]) => request<GameModes>(method, url)
  );

  const [releaseYearByExtended, setReleaseYearByExtended] = useState("");

  useEffect(() => {
    if (!(video instanceof AxiosError) && video) {
      setReleaseYearByExtended(getDateRelativeFromNowByYear(video.releaseYear));
    }
  }, [video]);

  return {
    releaseYearByExtended,
    video,
    modes,
  };
};
