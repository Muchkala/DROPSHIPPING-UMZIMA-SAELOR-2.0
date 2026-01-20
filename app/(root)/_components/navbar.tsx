"use client"

import DarkToggle from "@/app/@components/DarkToggle";
import { NavbarUser } from "@/components/navbar-user";

export default function Navbar() {
  const user = {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/user.jpg",
  };

  return (
    <div className="flex items-center justify-end w-full px-4 gap-2">
      <DarkToggle />
      <NavbarUser user={user} />
    </div>
  )
}
