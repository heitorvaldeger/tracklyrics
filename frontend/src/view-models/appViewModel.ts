import { ONE_DAY } from "@/constants/time"
import { genreService } from "@/services/genre-service"
import { languageService } from "@/services/language-service"
import { useQuery } from "@tanstack/react-query"

export const useAppViewModel = () => {
  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: ({ signal }) => genreService({ signal }),
    staleTime: ONE_DAY
  })

  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: ({ signal }) => languageService({ signal }),
    staleTime: ONE_DAY,
  })

  return {
    genres,
    languages
  }
}