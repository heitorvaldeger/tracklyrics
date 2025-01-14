import { FaCalendar, FaYoutube, FaUser } from "react-icons/fa"
import { FaXmark, FaPencil } from "react-icons/fa6"
import { Button, Card, CardContent } from "@/components/ui"
import usFlag from "@/assets/images/flags/us.svg"
import { Video } from "@/models/video"

type CardVideoProps = {
  video: Video,
  hasActionDelete?: boolean
  hasActionEdit?: boolean
  onDelete?: () => void
  onEdit?: () => void
}

export const CardVideo = ({ video, onDelete, onEdit }: CardVideoProps) => {
  return (
    <Card className="sm:w-2/3 md:w-full rounded-lg flex flex-col">
      <CardContent className="p-0 group overflow-hidden relative">
        <div className="relative h-36 bg-cover rounded-t-lg bg-center transition-all duration-300 group-hover:opacity-80 group-hover:bg-red-500 bg-left"
          style={{
            backgroundImage: "url(https://img.youtube.com/vi_webp/t7bQwwqW-Hc/maxresdefault.webp)"
          }}>
          {
            (onDelete || onEdit) && (
              <div className="absolute inset-0 rounded-t-lg bg-black bg-opacity-90 flex items-center justify-end px-4 py-2 opacity-0 group-hover:opacity-90 transition-opacity duration-300">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                  {
                    onDelete && (
                      <Button variant="outline" size="icon" className="bg-transparent rounded-full hover:bg-black-600 hover:opacity-50 [&_svg]:size-3">
                        <FaXmark color="white" />
                      </Button>
                    )
                  }
                  {
                    onEdit && (
                      <Button variant="outline" size="icon" className="bg-transparent rounded-full hover:bg-black-600 hover:opacity-50 [&_svg]:size-3">
                        <FaPencil color="white" />
                      </Button>
                    )
                  }
                </div>
              </div>
            )
          }
        </div>

        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <p className="text-ellipsis overflow-hidden whitespace-nowrap">{video.title}</p>
            <img src={usFlag} width={20} className="rounded-sm" />
          </div>
          <p className="text-sm font-light" >{video.artist}</p>

          <hr className="my-2" />

          <div className="flex items-center gap-1">
            <FaCalendar size={16} className="text-gray-500" />
            <p className="text-sm text-gray-500">{video.releaseYear}</p>
          </div>
          <div className="flex items-center gap-1">
            <FaYoutube size={16} className="text-gray-500" />
            <p className="text-sm text-gray-500">{`${video.qtyViews} plays`}</p>
          </div>
          <div className="flex items-center gap-1">
            <FaUser size={16} className="text-gray-500" />
            <p className="text-sm text-gray-500">{`Uploaded by: ${video.username}`}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}