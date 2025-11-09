"use client";

import { Inspect, LogOut, Bell, Search } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signOut, useSession } from "@workspace/shared/auth/client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "./ui/badge";

interface NavbarProps {
  workspace: {
    id: string;
    name: string;
    slug: string;
    userId: string;
  };
}

export default function Navbar({ workspace }: NavbarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const workspaceSlug = params.workspaceSlug as string;

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully.");
    router.push("/");
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const navItems = [
    { name: "Projects", value: "projects", href: `/${workspaceSlug}` },
    { name: "Deployments", value: "deployments", href: `/${workspaceSlug}/deployments` },
    { name: "Domains", value: "domains", href: `/${workspaceSlug}/domains` },
    { name: "Settings", value: "settings", href: `/${workspaceSlug}/settings` },
  ] as const;

  const getCurrentTab = () => {
    const sorted = [...navItems].sort((a, b) => b.href.length - a.href.length);
    const currentItem = sorted.find((item) => pathname?.startsWith(item.href));
    return currentItem?.value || navItems[0].value;
  };

  const handleTabChange = (value: string) => {
    const item = navItems.find((nav) => nav.value === value);
    if (item) router.push(item.href);
  };

  return (
    <header className="bg-background sticky top-0 z-50 border-b">
      <div className="px-6 pb-3">
        <div className="flex h-14 items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <Link href={`/${workspaceSlug}`} className="flex items-center gap-2 hover:opacity-80">
              <Inspect className="h-5 w-5" />
              <span className="font-semibold text-base">buildrr</span>
            </Link>

            <Badge>
              <div className="flex items-center gap-2 text-sm">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={session?.user?.image ?? ""} alt={session?.user?.name ?? "User"} />
                  <AvatarFallback className="text-[10px]">{getInitials(session?.user?.name)}</AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground">/</span>
                <span className="font-medium">{workspace.name}</span>
              </div>
            </Badge>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Search className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user?.image ?? ""} alt={session?.user?.name ?? "User"} />
                    <AvatarFallback className="text-xs">
                      {getInitials(session?.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-500 hover:text-red-600 font-semibold"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="w-full max-w-[1200px] px-6">
        <Tabs value={getCurrentTab()} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-background rounded-none p-0 justify-start">
            {navItems.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="w-[120px] rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
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
