import React from 'react'
import { DropdownMenuLabel, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { LogOutIcon, Moon } from "lucide-react"


const Dropdown = () => {
  return (
    <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56 bg-neutral-800 text-white border-neutral-700"
              align="start"
            >
              <DropdownMenuLabel className="text-white">
                My Account
              </DropdownMenuLabel>

              {/* Profile */}
              <DropdownMenuItem
                className="hover:bg-neutral-700 hover:text-white focus:bg-neutral-700"
              >
                Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-neutral-700" />

              {/* Dark Mode Toggle */}
              <DropdownMenuItem
                onClick={() => document.documentElement.classList.toggle("dark")}
                className="hover:bg-neutral-700 hover:text-white focus:bg-neutral-700 flex items-center justify-between"
              >
                Dark Mode
                <Moon className="w-4 h-4 text-white" />
              </DropdownMenuItem>

              {/* Logout */}
              <DropdownMenuItem
                className="hover:bg-neutral-700 hover:text-white focus:bg-neutral-700 flex items-center justify-between"
              >
                Log out
                <LogOutIcon className="w-4 h-4 text-white" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
  )
}

export default Dropdown
