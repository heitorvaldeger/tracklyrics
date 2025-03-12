import { useQuery } from "react-query";
import { useSearchParams } from "react-router";

import { fetchVideos } from "@/api/fetch-videos";
import { CardVideo } from "@/components/cards/card-video";
import { useGenreLanguage } from "@/contexts/genre-language-context";

export const VideoSearch = () => {
  const [searchParams] = useSearchParams();
  const uuid = searchParams.get("uuid") ?? null;
  const genreId = searchParams.get("genreId") ?? null;
  const languageId = searchParams.get("languageId") ?? null;

  const { genres, languages } = useGenreLanguage();

  const { data: videos } = useQuery({
    queryKey: ["videos", genreId, languageId, uuid],
    queryFn: () =>
      fetchVideos({
        genreId,
        languageId,
        uuid,
      }),
    staleTime: 60000,
  });

  const genre = genres.find((genre) => genre.id.toString() === genreId);
  const language = languages.find(
    (language) => language.id.toString() === languageId,
  );

  return (
    <div className="flex flex-col gap-4">
      {(genre || language) && (
        <div className="flex gap-2 items-center text-2xl text-center md:text-left">
          {genre && (
            <span className="text-primary font-semibold">{genre.name}</span>
          )}

          {genre && language && " | "}

          {language && (
            <img
              src={`/assets/images/flags/${language?.flagCountry}.svg`}
              alt={language?.flagCountry}
              width={32}
              className="rounded"
            />
          )}
          <span className="font-light">lyrics</span>
        </div>
      )}

      <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 place-items-center md:place-items-start">
        {videos && videos.length > 0
          ? videos?.map((video) => <CardVideo key={video.uuid} video={video} />)
          : "Nenhum vídeo foi encontrado"}
      </div>
    </div>
  );
};
