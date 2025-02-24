import { Button } from "@/components/ui/_index"
import { AxiosError, HttpStatusCode } from "axios"
import { NotFoundView } from "../NotFoundView"
import { useGameModes } from "@/hooks/use-game-modes"

export const GameModesView = () => {
  const { modes, video, releaseYearByExtended, error } = useGameModes()

  if (error instanceof AxiosError) {
    if (error.status === (HttpStatusCode.BadRequest || HttpStatusCode.NotFound)) {
      return <NotFoundView />
    }

    return <NotFoundView />
  }

  return (
    <main className="flex flex-col gap-8">
      <section className="flex justify-center">
        <p className="text-3xl font-bold text-gray-700">Select a Game Mode</p>
      </section>
      <section className="flex flex-col gap-4">
        <div className="flex gap-4 h-24">
          <Button className="bg-green-600 h-auto flex-1 flex px-6 flex-col items-start hover:bg-green-800">
            <p className="text-2xl font-bold">Beginner</p>
            Fill {modes?.beginner.totalFillWords} random words of {modes?.totalWords} (10%)
          </Button>
          <Button className="bg-yellow-600 h-auto flex-1 flex px-6 flex-col items-start hover:bg-yellow-800">
            <p className="text-2xl font-bold">Intermediate</p>
            Fill {modes?.intermediate.totalFillWords} random words of {modes?.totalWords} (25%)
          </Button>
        </div>
        <div className="flex gap-4 h-24">
          <Button className="bg-purple-600 h-auto flex-1 flex px-6 flex-col items-start hover:bg-purple-800">
            <p className="text-2xl font-bold">Advanced</p>
            Fill {modes?.advanced.totalFillWords} random words of {modes?.totalWords} (50%)
          </Button>
          <Button className="bg-red-600 flex h-auto flex-1 px-6 py-4 flex-col items-start hover:bg-red-800">
            <p className="text-2xl font-bold">Especialist</p>
            Fill all the words ({modes?.totalWords}), are you crazy?
          </Button>
        </div>
      </section>
      <section className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <p className="text-teal-500 text-lg">{video?.title}</p>

          <div className="flex font-light">
            <span>{releaseYearByExtended}</span>
            <span className="before:content-['\2022'] before:mx-1">0 plays</span>
            <span className="before:content-['\2022'] before:mx-1">{video?.username}</span>
          </div>
        </div>
        <p className="text-lg">{video?.artist}</p>
      </section>
    </main>
  )
}