import { CardVideo } from "@/components/CardVideo"
import { favoriteService } from "@/services/favorites-service"
import { useQuery } from "@tanstack/react-query"

export const FavoritesView = () => {
  const { data: favorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: ({ signal }) => favoriteService({ signal }),
  })

  return (
    <div className="flex flex-col gap-4">
      <p className="text-2xl font-semibold text-center md:text-left">Here's your favorites</p>
      <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 place-items-center md:place-items-start">
        {
          favorites?.map(video => (
            <CardVideo key={video.uuid} video={video} onDelete={(videoUuid: string) => {
              console.log(videoUuid)
            }} />
          ))
        }
      </div>
    </div>
  )
}