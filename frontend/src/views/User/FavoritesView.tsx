import { CardVideo } from "@/components/CardVideo"
import { useFavoriteViewModel } from "@/view-models/favoriteViewModel"

export const FavoritesView = () => {
  const { favorites, removeVideoFromFavorites } = useFavoriteViewModel()

  return (
    <div className="flex flex-col gap-4">
      <p className="text-2xl font-semibold text-center md:text-left">Here's your favorites</p>
      <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 place-items-center md:place-items-start">
        {
          favorites?.map(favorite => (
            <CardVideo key={favorite.uuid} video={favorite} onDelete={removeVideoFromFavorites} />
          ))
        }
      </div>
    </div>
  )
}