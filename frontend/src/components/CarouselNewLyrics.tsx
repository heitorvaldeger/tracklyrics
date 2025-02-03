import { MdFiberNew } from "react-icons/md";
import {
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious
} from "@/components/ui"

import { videos } from "@/__mocks__/videos"
import { CardVideo } from "@/components/CardVideo"

export const CarouselNewLyrics = () => {
  return (
    <>
      <header className="flex items-center gap-1">
        <MdFiberNew size={20} />
        <p className="text-xl">New Lyrics</p>
      </header>

      <div className="py-5">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {videos.map(video => (
              <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={video.uuid}>
                <CardVideo video={video} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="rounded-sm" />
          <CarouselNext className="rounded-sm" />
        </Carousel>
      </div>
    </>
  )
}