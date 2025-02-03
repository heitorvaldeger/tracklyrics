"use client"

import React from "react"
import { IoMusicalNotes, IoEarth } from "react-icons/io5"

import {
  NavigationMenu, 
  NavigationMenuTrigger, 
  NavigationMenuItem, 
  NavigationMenuList, 
  NavigationMenuContent, 
  ListItem,
  ScrollArea,
  Input
} from "@/components/ui"
import { useNavigate } from "react-router"
import { useAppViewModel } from "@/view-models/appViewModel"

export const AppBar = ({ children }: React.PropsWithChildren) => {
  const navigate = useNavigate()
  const { genres, languages } = useAppViewModel()

  return (
    <div className="w-full h-12 flex justify-center bg-gray-50">
      <div className="w-full flex">
        <div className="w-1/4 mx-2 bg-gray-200 flex justify-center items-center cursor-pointer" onClick={() => navigate("/")}>
          Logo
        </div>
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
                      <ListItem
                        key={genre.id}
                        title={genre.name}
                      >
                      </ListItem>
                    ))}
                  </ul>
                </ScrollArea>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-light gap-1 bg-transparent">
                <IoEarth size={12} />
                Languages
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ScrollArea className="h-96 w-auto rounded-md border p-4">
                  <ul className="grid gap-3 p-4 sm:w-[300px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {languages?.map((language) => (
                      <ListItem
                        key={language.id}
                        title={language.name}
                      >
                      </ListItem>
                    ))}
                  </ul>
                </ScrollArea>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Input id="searchVideo" placeholder="Search song or artist" className="my-auto"/>
        {children}
      </div>
    </div>
  )
}