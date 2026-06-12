import { CursorGlitter } from "@/modules/home/CursorGlitter";
import { SessionProvider } from "next-auth/react";
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SessionProvider>
        <CursorGlitter />
        {children}
      </SessionProvider>
    </>
  );
}
