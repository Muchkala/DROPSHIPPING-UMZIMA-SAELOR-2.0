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
        isRender && resolvedTheme === 'dark' ? <Button onClick={() => setTheme('light')}><Sun /></Button> : <Button onClick={() => setTheme('dark')}><Moon /></Button>
    )
}
