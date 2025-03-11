import usFlag from "@/assets/images/flags/us.svg";
import Autoplay from "embla-carousel-autoplay";

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "../../../components/ui/carousel";
import { useCallback, useEffect, useState } from "react";
import { videos } from "@/__mocks__/videos";
import { getDateRelativeFromNowByYear } from "@/lib/utils";

export const CarouselVideo = () => {
  const [carouselAPI, setCarouselAPI] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = (index: number) => {
    if (!carouselAPI) return;

    carouselAPI.scrollTo(index);
  };

  const onSelect = useCallback(() => {
    if (!carouselAPI) return;

    setSelectedIndex(carouselAPI.selectedScrollSnap());
  }, [carouselAPI]);

  useEffect(() => {
    if (!carouselAPI) return;
    onSelect();

    setScrollSnaps(carouselAPI.scrollSnapList());
    carouselAPI.on("select", onSelect);
  }, [carouselAPI, onSelect]);

  return (
    <div className="flex flex-col gap-2">
      <Carousel
        className="h-80"
        setApi={setCarouselAPI}
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
      >
        <CarouselContent className="flex">
          {videos.map((video) => (
            <CarouselItem key={video.uuid} className="relative">
              <div
                className="h-80 bg-cover bg-center flex justify-center items-end rounded-md"
                style={{
                  backgroundImage: `url(${video.thumbnail})`,
                }}
              >
                <div className="bg-gray-900/[.8] text-white rounded-b- px-4 py-2 flex-1 rounded-b-md">
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-lg">{video.title}</p>
                    <img src={usFlag} width={20} className="rounded-sm" />
                  </div>
                  <p className="font-light text-sm">{video.artist}</p>
                  <div className="flex">
                    <p className="font-light text-sm">{getDateRelativeFromNowByYear(video.releaseYear)}</p>
                    <p className="font-light text-sm before:content-['\2022'] before:px-1">{`${video.qtyViews} players`}</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex items-center justify-center gap-2">
        {scrollSnaps.map((_, idx) => (
          <span key={idx} onClick={() => scrollTo(idx)} data-actived={selectedIndex === idx} className="h-2.5 w-2.5 rounded-full bg-gray-500 data-[actived=true]:bg-teal-500 cursor-pointer" />
        ))}
      </div>
    </div>
  );
};
