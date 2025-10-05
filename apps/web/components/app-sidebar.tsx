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
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
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
