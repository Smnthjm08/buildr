"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  {
    name: "Projects",
    value: "projects",
    href: "/dashboard",
    description: (
      <>
        Manage your <span className="font-semibold text-foreground">projects</span> efficiently. Create, update, and track all your builds from one place.
      </>
    ),
  },
  {
    name: "Deployments",
    value: "deployments",
    href: "/deployments",
    description: (
      <>
        View your <span className="font-semibold text-foreground">deployment</span> history, monitor status, and manage environments seamlessly.
      </>
    ),
  },
  {
    name: "Domains",
    value: "domains",
    href: "/domains",
    description: (
      <>
        Manage and connect your <span className="font-semibold text-foreground">domains</span>. Secure, fast, and easy configuration.
      </>
    ),
  },
  {
    name: "Settings",
    value: "settings",
    href: "/settings",
    description: (
      <>
        Customize your <span className="font-semibold text-foreground">account settings</span> and workspace preferences effortlessly.
      </>
    ),
  },
];

const NavbarTabs = () => {
  const pathname = usePathname();
  const router = useRouter();

  const getCurrentTab = () => {
    const currentItem = navItems.find((item) =>
      pathname?.startsWith(item.href)
    );
    return currentItem?.value || "projects";
  };

  const handleTabChange = (value: string) => {
    const item = navItems.find((nav) => nav.value === value);
    if (item) router.push(item.href);
  };

  return (
    <div className="w-full max-w-5xl">
      <Tabs value={getCurrentTab()} onValueChange={handleTabChange}>
        <TabsList className="bg-background border-b rounded-none p-0 justify-start">
          {navItems.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground"
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {navItems.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <p className="text-sm text-muted-foreground mt-2">
              {tab.description}
            </p>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default NavbarTabs;
