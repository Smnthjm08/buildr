"use client";

import { Inspect, User, LogOut, Settings, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signOut, useSession } from "@workspace/shared/auth/client";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    console.log("Logging out...");
    await signOut();
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const navItems = [
    { name: "Projects", value: "projects", href: "/dashboard" },
    { name: "Deployments", value: "deployments", href: "/deployments" },
    { name: "Domains", value: "domains", href: "/domains" },
    { name: "Settings", value: "settings", href: "/settings" },
  ];

  const getCurrentTab = () => {
    const currentItem = navItems.find(item => pathname?.startsWith(item.href));
    return currentItem?.value || "projects";
  };

  const handleTabChange = (value: string) => {
    const item = navItems.find(nav => nav.value === value);
    if (item) {
      router.push(item.href);
    }
  };

  return (
    <header className="border-b bg-background">
      {/* Top bar with logo and user */}
      <div className=" px-4 md:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Left: Logo and project selector */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-foreground hover:opacity-80">
              <Inspect className="h-5 w-5" />
              <span className="font-semibold text-base">buildrr</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border bg-muted/30 text-sm">
              <Avatar className="h-5 w-5">
                <AvatarImage src={session?.user?.image ?? ""} alt={session?.user?.name} />
                <AvatarFallback className="text-[10px]">
                  {getInitials(session?.user?.name || "U")}
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium">{session?.user?.name}&apos;s projects</span>
            </div>
          </div>

          {/* Right: Actions and user menu */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 hidden md:flex">
              <Search className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="h-4 w-4" />
            </Button>

            {session?.user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user.image ?? ""}
                        alt={session.user.name}
                      />
                      <AvatarFallback className="text-xs">
                        {getInitials(session.user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Account Settings</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar with tabs */}
      <div className="px-4 md:px-6">
        <Tabs value={getCurrentTab()} onValueChange={handleTabChange} className="w-full">
          <TabsList className="h-12 bg-transparent border-b-0 rounded-none p-0 w-full justify-start">
            {navItems.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {item.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </header>
  );
}