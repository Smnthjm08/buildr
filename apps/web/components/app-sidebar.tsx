"use client";

import {
  Donut,
  Home,
  User,
  Wallet,
  Settings,
  Gift,
  LayoutDashboard,
  Code,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuSections = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "My Page", url: "/u/me", icon: Home },
      { title: "Supporters", url: "/supporters", icon: Gift },
    ],
  },
  {
    label: "Profile",
    items: [
      { title: "My Profile", url: "/my-profile", icon: User },
      { title: "Embed Widget", url: "/widget", icon: Code },
    ],
  },
  {
    label: "Earnings",
    items: [
      { title: "Earnings", url: "/earnings", icon: Wallet },
      { title: "Transactions", url: "/transactions", icon: Gift },
    ],
  },
  {
    label: "Settings",
    items: [{ title: "Settings", url: "/settings", icon: Settings }],
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Donut width={20} height={20} /> SolDonut
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = pathname === item.url;
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-2 transition-colors duration-200",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-foreground",
                        )}
                      >
                        <Link href={item.url}>
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="text-xs text-muted-foreground">
        © 2025 SolDonut
      </SidebarFooter>
    </Sidebar>
  );
}
