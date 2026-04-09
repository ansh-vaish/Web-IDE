import Header from "@/modules/home/header";
import Footer from "@/modules/home/footer";
import { CursorGlitter } from "@/modules/home/CursorGlitter";
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="h-screen bg-black">
        <CursorGlitter />
        {/* Main Container */}
        <div className="h-full bg-black p-3 md:p-6">
          <div className="h-full max-w-full mx-auto bg-linear-to-b from-zinc-900 to-black rounded-3xl overflow-hidden border border-zinc-800/50 flex flex-col">
            <Header />
            <main className="flex-1 min-h-0">{children}</main>
            {/* <Footer /> */}
          </div>
        </div>
      </div>
    </>
  );
}
