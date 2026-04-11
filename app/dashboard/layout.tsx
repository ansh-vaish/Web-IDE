import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getAllPlaygroundsOfUser } from "@/modules/dashboard/actions";
import { DashboardSidebar } from "@/modules/dashboard/components/dashboard-sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const importedPlayground = await getAllPlaygroundsOfUser();

  const techIconMap: Record<string, string> = {
    REACT: "Zap",
    NEXTJS: "Lightbulb",
    EXPRESS: "Database",
    VUE: "Compass",
    HONO: "FlameIcon",
    ANGULAR: "Terminal",
  };

  const formattedPlaygrounds = (importedPlayground ?? []).map(
    (playground: any) => ({
      ...playground,
      name: playground.title,
      icon: techIconMap[playground.template] || "Code2",
      starred: playground.Starmark?.[0]?.isMarked || false,
    }),
  );

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen w-full bg-black">
          <div className="min-h-screen w-full overflow-hidden border-y border-zinc-800/50 bg-linear-to-b from-zinc-900 to-black md:border-x">
            <div className="flex min-h-screen w-full overflow-x-hidden">
              <DashboardSidebar initialPlaygroundData={formattedPlaygrounds} />
              <main className="w-full overflow-y-auto">{children}</main>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
