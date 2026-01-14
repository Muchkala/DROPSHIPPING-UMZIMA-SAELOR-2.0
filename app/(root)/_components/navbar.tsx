"use client"

import DarkToggle from "@/app/components/DarkToggle";
import { menuLinks } from "@/app/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Search from "./search";
import Mobile from "./mobile";

export default function Navbar() {
  const pathname = usePathname()
  return (
    <nav className="w-full fixed inset-0 md:py-0 z-30 h-[10vh] backdrop-blur-sm border-b">
      <div className="max-w-[1200px] mx-auto h-full flex px-[15px] items-center justify-between ">
        <Link href={'/'} className="text-[18px] font-lato hover:text-[crimson]">
          fintechhub
        </Link>
        <ul className="flex gap-[20px]">
          {menuLinks.map(({ id, linkName, slug }) => {
            return <li key={id}>
              <Link
                className={cn("text-[15px] font-medium hover:text-[crimson]", pathname === slug && 'text-[crimson] border-b-[2px] pb-[2px] border-[crimson]')}
                href={slug}>
                {linkName}
              </Link>
            </li>
          })}
        </ul>

        <div className="flex gap-[20px] items-center">
          <Search/>
          <DarkToggle />
          <Mobile/>
        </div>
      </div>
    </nav>
  )
}
