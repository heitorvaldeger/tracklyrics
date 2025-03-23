import { Copyright, Heart } from "lucide-react";

import { SiFacebook, SiInstagram, SiX } from "@icons-pack/react-simple-icons";

import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground flex w-full flex-col items-center justify-between px-10 py-6 md:flex-row">
      <div className="flex flex-col gap-2">
        <div className="flex justify-center gap-3 md:justify-normal">
          <SiFacebook size={16} />
          <SiX size={16} />
          <SiInstagram size={16} />
        </div>
        <p className="flex items-center justify-center gap-1 after:px-1 md:justify-normal">
          <Copyright size={16} />
          {new Date().getUTCFullYear() + " "}
          Made with <Heart size={16} />
          tracklyrics.com
        </p>
      </div>

      <div className="flex flex-row justify-center gap-4 md:justify-normal">
        <Button variant="link" className="text-primary-foreground p-0">
          About
        </Button>
        <Button variant="link" className="text-primary-foreground p-0">
          Contact
        </Button>
        <Button variant="link" className="text-primary-foreground p-0">
          Privacy Policy
        </Button>
        <Button variant="link" className="text-primary-foreground p-0">
          Terms of Use
        </Button>
      </div>
    </footer>
  );
};
