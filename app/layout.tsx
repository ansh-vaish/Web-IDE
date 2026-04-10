import type { Metadata } from "next";
import "./globals.css";
import {Toaster}  from "@/components/ui/sonner";
export const metadata: Metadata = {
  title: {
    template: "IDE",
    default: "Trace - Your Cloud IDE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="scheme-dark bg-background text-foreground antialiased">
        <div className="flex flex-col min-h-screen">
          <Toaster/>
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
