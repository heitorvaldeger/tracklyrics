import { FaFacebook, FaHeart, FaInstagram } from "react-icons/fa"
import { FaX } from "react-icons/fa6"
import { Button } from "@/components/ui"

export const AppFooter = () => {
  return (
    <footer className="px-10 py-10 mt-6 bg-gray-50 flex justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <FaFacebook/>
            <FaX/>
            <FaInstagram />
          </div>
          <p className="before:content-['\00A9'] after:px-1 flex gap-1 items-center">
            {new Date().getUTCFullYear() + " "}
            Made with <FaHeart />
            tracklyrics.com
          </p>
        </div>

        <div className="flex flex-row gap-4">
          <Button variant="link" className="p-0">
            About
          </Button>
          <Button variant="link" className="p-0">
            Contact
          </Button>
          <Button variant="link" className="p-0">
            Privacy Policy
          </Button>
          <Button variant="link" className="p-0">
            Terms of Use
          </Button>
        </div>
      </footer>
  )
}