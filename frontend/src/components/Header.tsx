"use client";

import React from "react";
import { IoEarth, IoMusicalNotes } from "react-icons/io5";

import { NavigationMenu, NavigationMenuTrigger, NavigationMenuItem, NavigationMenuList, NavigationMenuContent, ListItem, ScrollArea, Input } from "@/components/ui/_index";
import { useNavigate } from "react-router";
import { ListItemLanguage } from "./ui/navigation-list-item-language";
import { useGenre } from "@/contexts/GenreContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Logo } from "./logo";

export const Header = ({ children }: React.PropsWithChildren) => {
  const navigate = useNavigate();
  const { genres } = useGenre();
  const { languages, currentLanguage, handleSetLanguageClick, getLanguageImage } = useLanguage();

  return (
    <div className="w-full flex justify-center py-2">
      <div className="w-full flex gap-2 h-11">
        <Logo />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-light gap-1 bg-transparent">
                <IoMusicalNotes size={12} />
                Genres
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ScrollArea className="h-96 w-auto rounded-md border p-4">
                  <ul className="grid gap-3 p-4 sm:w-[300px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {genres?.map((genre) => (
                      <ListItem key={genre.id} title={genre.name} onClick={() => navigate(`search/${genre.id}`)}></ListItem>
                    ))}
                  </ul>
                </ScrollArea>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-light gap-1 bg-transparent">
                {currentLanguage ? (
                  <div className="flex gap-3 items-center">
                    <div className="flex flex-col justify-start items-start">
                      <p className="text-xs">Learning</p>
                      <p className="text-md font-bold">{currentLanguage.name}</p>
                    </div>
                    {currentLanguage.flagCountry && <img src={getLanguageImage(currentLanguage.flagCountry)} width={32} className="rounded" />}
                  </div>
                ) : (
                  <>
                    <IoEarth size={12} />
                    Languages
                  </>
                )}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ScrollArea className="h-96 w-auto rounded-md border p-4">
                  <ul className="grid gap-3 w-[200px]">
                    {languages?.map(({ id, name, flagCountry }) => (
                      <ListItemLanguage key={id} title={name} onClick={() => handleSetLanguageClick(id)}>
                        {flagCountry && <img src={getLanguageImage(flagCountry)} alt={flagCountry} width={36} className="rounded" />}
                      </ListItemLanguage>
                    ))}
                  </ul>
                </ScrollArea>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Input id="searchVideo" placeholder="Search song or artist" className="my-auto shadow-none" />
        {children}
      </div>
    </div>
  );
};
