import { SidebarProvider } from "@/components/ui/sidebar";
function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return <SidebarProvider>{children}</SidebarProvider>;
}

export default PlaygroundLayout;
