import { CardVideo } from "@/components/card-video";
import { useVideoSearch } from "@/hooks/use-video-search";
import { NotFound } from "../404";

export const VideoSearchView = () => {
  const { videos, genreSelected } = useVideoSearch();

  if (!genreSelected) {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col gap-4">
      {genreSelected && (
        <div className="flex gap-2 items-center text-2xl text-center md:text-left">
          <span className="text-teal-500 font-semibold">{genreSelected.name}</span>
          <span className="font-light">lyrics</span>
        </div>
      )}

      <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 place-items-center md:place-items-start">{videos && videos.length > 0 ? videos?.map((video) => <CardVideo key={video.uuid} video={video} />) : "Nenhum vídeo foi encontrado"}</div>
    </div>
  );
};
