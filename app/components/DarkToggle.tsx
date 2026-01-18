'use client'

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export default function DarkToggle() {
    const { setTheme, resolvedTheme } = useTheme()
    const [isRender, setIsRender] = useState(false)
    useEffect(() => { setIsRender(true) }, [])
    return (
        isRender && resolvedTheme === 'dark' ? 
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-md hover:bg-accent transition-all duration-200" onClick={() => setTheme('light')}>
                <Sun className="h-10 w-10 text-amber-500" strokeWidth={3} />
            </Button> : 
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-md hover:bg-accent transition-all duration-200" onClick={() => setTheme('dark')}>
                <Moon className="h-10 w-10 text-black fill-black" strokeWidth={3} />
            </Button>
    )
}
