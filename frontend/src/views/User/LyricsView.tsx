import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button"

import { videos } from "@/__mocks__/videos"
import { CardVideo } from "@/components/CardVideo";
export const LyricsView = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <p className="text-2xl font-semibold text-center md:text-left">Here's your lyrics uploaded</p>
        <Button className="bg-teal-500 hover:bg-teal-800">
          <FaPlus size={18} />
          Add Lyrics
        </Button>
      </div>

      <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 place-items-center md:place-items-start">
        {
          videos.map(video => (
            <CardVideo key={video.uuid} video={video} onDelete={() => {}} onEdit={() => {}} />
          ))
        }
      </div>
    </div>
  )
}