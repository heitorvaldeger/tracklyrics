import { CarouselVideo } from "@/components/CarouselVideo"
import { CarouselNewLyrics } from "@/components/CarouselNewLyrics"
import { CarouselTopLyrics } from "@/components/CarouselTopLyrics"

export const HomeView = () => {
  return (
    <div className='mx-auto py-10'>
      <CarouselVideo />
      <div className="flex flex-col py-12">
        <CarouselTopLyrics />
        <CarouselNewLyrics />
      </div>
    </div>
  )
}