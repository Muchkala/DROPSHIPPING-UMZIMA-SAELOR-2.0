"use client"

import DarkToggle from "@/app/components/DarkToggle";
import Search from "./search";

export default function Navbar() {
  return (
    <div className="flex items-center justify-end w-full px-4 gap-4">
      <Search/>
      <DarkToggle />
    </div>
  )
}
