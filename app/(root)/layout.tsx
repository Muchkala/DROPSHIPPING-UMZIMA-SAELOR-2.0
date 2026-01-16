"use client"

import React from 'react'
import { ChildProps } from '../types'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from '@/components/app-sidebar'
import Navbar from './_components/navbar'
import { usePathname } from 'next/navigation'

export default function Layout({ children }: ChildProps) {
    const pathname = usePathname()
    
    const isAuthPage = pathname === "/auth" || pathname === "/registration-success" || pathname === "/terms"

    return (
        <TooltipProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    {!isAuthPage && (
                        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                            <SidebarTrigger className="ml-4" />
                            <div className="flex-1">
                                <Navbar />
                            </div>
                        </header>
                    )}

                    <main className={!isAuthPage ? "flex-1 p-6" : "min-h-screen"}>
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}
