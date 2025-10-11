"use client";

import { useEffect, useState } from "react";
import {
  Donut,
  Home,
  User,
  Wallet,
  Settings,
  Gift,
  LayoutDashboard,
  Code,
  LogOutIcon,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { authClient } from "@repo/shared/client";

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isPending, data } = authClient.useSession();
  const [username, setUsername] = useState<string | null>(null);

  console.log("un", username);

  // wait until data is ready before rendering sidebar links
  useEffect(() => {
    if (!isPending && data?.user?.username) {
      setUsername(data.user.username);
    }
  }, [isPending, data]);

  if (isPending || !username) return null; // wait until username is available

  const menuSections = [
    {
      label: "Overview",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "My Page", url: `/${username}`, icon: Home },
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
      items: [
        { title: "Settings", url: "/settings", icon: Settings },
        { title: "Notifications", url: "/notifications", icon: Bell },
      ],
    },
  ];

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
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={async () =>
                    await authClient.signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          router.push("/signin");
                        },
                      },
                    })
                  }
                >
                  <LogOutIcon className="h-4 w-4 gap-2" />
                  Logout
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        © 2025 SolDonut
      </SidebarFooter>
    </Sidebar>
  );
}
