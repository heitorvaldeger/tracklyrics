import { Earth, Music } from "lucide-react";
import React from "react";
import { useNavigate, useSearchParams } from "react-router";

import { LogoApp } from "@/components/logo-app";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGenreLanguage } from "@/contexts/genre-language-context";

export const Header = ({ children }: React.PropsWithChildren) => {
  const navigate = useNavigate();
  const { genres, languages } = useGenreLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="flex w-full justify-center py-2">
      <div className="flex h-11 w-full gap-2">
        <LogoApp />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="gap-1 bg-transparent font-light">
                <Music size={12} />
                Genres
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ScrollArea className="h-96 w-auto rounded-md">
                  <div className="grid gap-3 sm:w-[300px] md:w-[500px] grid-cols-2 lg:w-[600px]">
                    {genres.map((genre) => (
                      <NavigationMenuLink
                        onClick={() => {
                          setSearchParams((state) => {
                            state.set("genreId", genre.id.toString());
                            return state;
                          });

                          navigate(`/search?${searchParams.toString()}`);
                        }}
                        key={genre.id}
                      >
                        {genre.name}
                      </NavigationMenuLink>
                    ))}
                  </div>
                </ScrollArea>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="gap-1 bg-transparent font-light">
                <Earth size={12} />
                Languages
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ScrollArea className="h-96 rounded-md w-[200px]">
                  {languages.map((language) => (
                    <NavigationMenuLink
                      key={language.id}
                      onClick={() => {
                        setSearchParams((state) => {
                          state.set("languageId", language.id.toString());
                          return state;
                        });

                        navigate(`/search?${searchParams.toString()}`);
                      }}
                      asChild
                    >
                      <div className="flex flex-row gap-2 items-center">
                        <img
                          src={`/assets/images/flags/${language.flagCountry}.svg`}
                          alt={language.flagCountry}
                          width={32}
                          className="rounded"
                        />
                        {language.name}
                      </div>
                    </NavigationMenuLink>
                  ))}
                </ScrollArea>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Input
          id="search-video"
          placeholder="Search song or artist"
          className="my-auto shadow-none"
        />
        {children}
      </div>
    </div>
  );
};
