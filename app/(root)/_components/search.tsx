import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { SearchIcon } from "lucide-react"

export default function Search() {
    return (
        <Drawer>
            <DrawerTrigger className={cn('cursor-pointer h-12 w-12 rounded-md hover:bg-accent transition-all duration-200 flex items-center justify-center')}>
                <SearchIcon className="h-8 w-8" />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Search</DrawerTitle>
                    <DrawerDescription>Search for content across the site</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                    <DrawerClose>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Enter search term..." 
                                className="flex-1 px-3 py-2 text-sm border rounded-md"
                            />
                            <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                                Search
                            </button>
                        </div>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
