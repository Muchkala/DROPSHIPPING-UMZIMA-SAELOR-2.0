"use client"

import React from 'react'
import { ChildProps } from '../types'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from '@/components/app-sidebar'
import Navbar from './_components/navbar'
import { usePathname } from 'next/navigation'
import { RequireAuth } from '@/app/@components/auth/require-auth'

export default function Layout({ children }: ChildProps) {
    const pathname = usePathname()
    
    const isAuthPage = pathname === "/auth" || pathname === "/registration-success" || pathname === "/terms"

    return (
        <RequireAuth>
            <TooltipProvider>
                <SidebarProvider style={{ "--sidebar-top": "56px" } as React.CSSProperties}>
                    <AppSidebar />
                    <SidebarInset className="pt-14">
                        {!isAuthPage && (
                            <header className="fixed left-0 right-0 top-0 z-50 flex h-14 shrink-0 items-center gap-2 bg-[#2f2f2f] text-white">
                                <SidebarTrigger className="ml-3 text-white hover:bg-white/10" />
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
        </RequireAuth>
    )
}
