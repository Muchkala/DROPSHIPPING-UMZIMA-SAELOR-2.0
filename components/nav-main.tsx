"use client"

import { type LucideIcon, ChevronRight, ChevronDown } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    badge?: string
    items?: {
      title: string
      url: string
      badge?: string
    }[]
  }[]
}) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(["Product"])

  const toggleExpand = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    )
  }

  return (
    <SidebarGroup className="p-3">
      <SidebarMenu className="gap-1">
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0
          const isExpanded = expandedItems.includes(item.title)
          
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={item.isActive ?? pathname === item.url}
                className="group relative h-10 rounded-xl px-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 data-[active=true]:bg-gray-900 data-[active=true]:text-white [&>svg]:size-4 [&>svg]:text-gray-500 [&[data-active=true]>svg]:text-white"
              >
                <a href={item.url} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </div>
                  {hasSubItems && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleExpand(item.title)
                      }}
                      className="ml-auto flex h-5 w-5 items-center justify-center rounded hover:bg-gray-200"
                    >
                      {isExpanded ? (
                        <ChevronDown className="size-3.5 text-gray-500" />
                      ) : (
                        <ChevronRight className="size-3.5 text-gray-500" />
                      )}
                    </button>
                  )}
                </a>
              </SidebarMenuButton>
              
              {hasSubItems && isExpanded && (
                <SidebarMenuSub className="relative ml-5 mt-1 gap-1 border-l-0 pl-0 before:absolute before:left-2 before:top-0 before:h-full before:w-px before:bg-gray-200">
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={pathname === subItem.url}
                        className="relative h-9 pl-6 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 before:absolute before:left-2 before:top-1/2 before:h-px before:w-4 before:bg-gray-200 data-[active=true]:bg-transparent data-[active=true]:font-medium data-[active=true]:text-gray-900"
                      >
                        <a href={subItem.url} className="flex items-center justify-between">
                          <span>{subItem.title}</span>
                          {subItem.badge && (
                            <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-md bg-orange-100 px-1.5 text-xs font-medium text-orange-600">
                              {subItem.badge}
                            </span>
                          )}
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
