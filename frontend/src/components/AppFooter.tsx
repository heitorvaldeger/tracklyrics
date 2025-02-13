import { FaFacebook, FaHeart, FaInstagram } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { Button } from "@/components/ui";

export const AppFooter = () => {
  return (
    <footer className="px-10 py-10 mt-6 flex justify-between absolute bottom-0 w-full flex-col md:flex-row bg-teal-500 text-white">
      <div className="flex flex-col gap-2">
        <div className="flex gap-3 justify-center md:justify-normal">
          <FaFacebook />
          <FaX />
          <FaInstagram />
        </div>
        <p className="before:content-['\00A9'] after:px-1 flex gap-1 items-center justify-center md:justify-normal">
          {new Date().getUTCFullYear() + " "}
          Made with <FaHeart />
          tracklyrics.com
        </p>
      </div>

      <div className="flex flex-row gap-4 justify-center md:justify-normal">
        <Button variant="link" className="p-0 text-white">
          About
        </Button>
        <Button variant="link" className="p-0 text-white">
          Contact
        </Button>
        <Button variant="link" className="p-0 text-white">
          Privacy Policy
        </Button>
        <Button variant="link" className="p-0 text-white">
          Terms of Use
        </Button>
      </div>
    </footer>
  );
};
