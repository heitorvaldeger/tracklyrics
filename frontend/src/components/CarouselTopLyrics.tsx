import { FaChartLine, FaChevronDown } from "react-icons/fa"
import { 
  Button, 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious
} from "@/components/ui"

import { videos } from "@/__mocks__/videos"
import { CardVideo } from "./CardVideo"

export const CarouselTopLyrics = () => {
  return (
    <>
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <FaChartLine size={20} />
          <p className="text-xl">Top Lyrics</p>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Button className="bg-teal-500 mx-2">
                Last Week
                <FaChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mx-3">
              <DropdownMenuItem>Last Month</DropdownMenuItem>
              <DropdownMenuItem>Last Year</DropdownMenuItem>
              <DropdownMenuItem>All time</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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