import { useNavigate } from "react-router"
import { Button } from "@/components/ui"
import { FaChevronLeft } from "react-icons/fa"

export const BackToHomeButton = () => {
  const navigate = useNavigate()

  return (
    <Button onClick={() => navigate("/")} className="rounded-3xl bg-transparent my-4 w-[150px]" variant="outline">
      <FaChevronLeft />
      Back to home
    </Button>
  )
}