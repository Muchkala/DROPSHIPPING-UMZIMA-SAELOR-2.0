import { cn } from "@/lib/utils";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTrigger,
  } from "@/components/ui/sheet"
import Link from "next/link";
import { menuLinks } from "@/app/constants";
export default function Mobile() {
  return (
    <Sheet>
  <SheetTrigger className={cn('cursor-pointer md:hidden')}>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetDescription>
        <Link href={'/'} className="text-[crimson]">fintechhub</Link>
        <ul className="flex flex-col gap-[20px]">
            {
                menuLinks.map(({ id, linkName, slug }) => {
                    return (
                        <li key={id}>
                            <Link href={slug}>{linkName}</Link>
                        </li>
                )
            })
        }
        </ul>
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
  )
}
