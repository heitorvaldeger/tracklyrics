import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button"

import { CardVideo } from "@/components/CardVideo";
import { useNavigate } from "react-router";
import useSWR from "swr";
import { ENDPOINTS } from "@/constants/endpoints";
import { useAPI } from "@/hooks/use-api";
import { Video } from "@/models/video";
import { API_METHODS } from "@/constants/api-methods";
export const LyricsView = () => {
  const navigate = useNavigate()
  const { request } = useAPI()

  const { data: videos, mutate } =
    useSWR([ENDPOINTS.USER_LYRICS, API_METHODS.GET], ([ url, method ]) => request<Video[]>(method, url))

  const handleDeleteLyric = async (videoUuid: string) => {
    await request(API_METHODS.DELETE, ENDPOINTS.VIDEOS_WITH_UUID(videoUuid))
    mutate()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <p className="text-2xl font-semibold text-center md:text-left">Here's your lyrics uploaded</p>
        <Button className="bg-teal-500 hover:bg-teal-800" onClick={() => navigate("/video/add")}>
          <FaPlus size={18} />
          Add Lyrics
        </Button>
      </div>

      <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 place-items-center md:place-items-start">
        {
          videos?.map(video => (
            <CardVideo
              key={video.uuid}
              video={video}
              onDelete={() => handleDeleteLyric(video.uuid)}
              onEdit={() => {}} />
          ))
        }
      </div>
    </div>
  )
}