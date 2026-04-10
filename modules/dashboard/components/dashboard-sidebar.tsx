"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  Compass,
  FolderPlus,
  History,
  Home,
  LayoutDashboard,
  Lightbulb,
  type LucideIcon,
  Plus,
  Settings,
  Star,
  Terminal,
  Zap,
  Database,
  FlameIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Define the interface for a single playground item, icon is now a string
interface PlaygroundData {
  id: string;
  name: string;
  icon: string; // Changed to string
  starred: boolean;
}

// Map icon names (strings) to their corresponding LucideIcon components
const lucideIconMap: Record<string, LucideIcon> = {
  Zap: Zap,
  Lightbulb: Lightbulb,
  Database: Database,
  Compass: Compass,
  FlameIcon: FlameIcon,
  Terminal: Terminal,
  Code2: Code2, // Include the default icon
  // Add any other icons you might use dynamically
};

export function DashboardSidebar({
  initialPlaygroundData,
}: {
  initialPlaygroundData: PlaygroundData[];
}) {
  const pathname = usePathname();
  const starredPlaygrounds = initialPlaygroundData.filter((p) => p.starred);
  const recentPlaygrounds = initialPlaygroundData;

  return (
    <Sidebar variant="inset"  className="rounded-lg">
      <div className="rounded-lg" />
      {/* Header */}
      <SidebarHeader className="px-3 pt-5 pb-4">
        <div className="flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/3">
            <Code2 className="h-5 w-5 text-white/85" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="relative px-2 pb-4">
        {/* Main Navigation */}
        <SidebarGroup className="py-2">
          <SidebarMenu className="space-y-1.5">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/"}
                tooltip="Home"
                className="group h-11 rounded-xl px-3 text-white/55 transition-all duration-200 hover:bg-white/4.5 hover:text-white data-[active=true]:bg-white/6 data-[active=true]:text-white"
              >
                <Link href="/" className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/4">
                    <Home className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/dashboard"}
                tooltip="Dashboard"
                className="group h-11 rounded-xl px-3 text-white/55 transition-all duration-200 hover:bg-white/4.5 hover:text-white data-[active=true]:bg-white/6 data-[active=true]:text-white"
              >
                <Link href="/dashboard" className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/4">
                    <LayoutDashboard className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <div className="mx-2 my-4 h-px bg-white/5" />

        {/* Starred */}
        <SidebarGroup className="py-2">
          <div className="mb-3 px-2">
            <SidebarGroupLabel className="p-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/28">
              Starred
            </SidebarGroupLabel>
          </div>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {starredPlaygrounds.length === 0 ? (
                <div className="mx-1 rounded-xl border border-white/5 bg-white/2 px-3 py-3 text-xs text-white/30">
                  No starred playgrounds
                </div>
              ) : (
                starredPlaygrounds.map((playground) => {
                  const IconComponent = lucideIconMap[playground.icon] || Code2;

                  return (
                    <SidebarMenuItem key={playground.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/playground/${playground.id}`}
                        tooltip={playground.name}
                        className="group h-10 rounded-xl px-3 text-white/52 transition-all duration-200 hover:bg-white/4.5 hover:text-white data-[active=true]:bg-white/6 data-[active=true]:text-white"
                      >
                        <Link
                          href={`/playground/${playground.id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/4">
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <span className="truncate text-sm">
                            {playground.name}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mx-2 my-4 h-px bg-white/5" />

        {/* Recent */}
        <SidebarGroup className="py-2">
          <div className="mb-3 flex items-center justify-between px-2">
            <SidebarGroupLabel className="p-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/28">
              Recent
            </SidebarGroupLabel>

            <SidebarGroupAction
              title="Create new playground"
              className="h-7 w-7 rounded-lg border border-white/6 bg-white/2.5 text-white/35 hover:bg-white/5 hover:text-white"
            >
              <FolderPlus className="h-3.5 w-3.5" />
            </SidebarGroupAction>
          </div>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {recentPlaygrounds.map((playground) => {
                const IconComponent = lucideIconMap[playground.icon] || Code2;

                return (
                  <SidebarMenuItem key={playground.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/playground/${playground.id}`}
                      tooltip={playground.name}
                      className="group h-10 rounded-xl px-3 text-white/52 transition-all duration-200 hover:bg-white/4.5 hover:text-white data-[active=true]:bg-white/6 data-[active=true]:text-white"
                    >
                      <Link
                        href={`/playground/${playground.id}`}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/4">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <span className="truncate text-sm">
                          {playground.name}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
