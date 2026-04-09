import { Code2, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import Link from "next/link";
import UserButton from "@/modules/auth/components/user-button";

export default async function Header() {
  const session = await auth();

  return (
    <header className="relative z-50">
      {/* bottom divider */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

      {/* center transition glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
        <div className="h-28 w-130 rounded-full bg-purple-500/10 blur-[90px]" />
      </div>

      {/* subtle dark blend */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/2 via-transparent to-transparent" />

      <nav className="relative px-6 py-5 md:px-8">
        <div className="flex items-center justify-between">
          {/* LEFT: Brand */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_35px_rgba(168,85,247,0.12)] backdrop-blur-md transition group-hover:scale-[1.02]">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-purple-500/10 via-transparent to-indigo-500/10" />
              <Code2 className="relative h-5 w-5 text-white" />
            </div>

            <div className="hidden leading-tight sm:block">
              <p className="text-xl font-semibold tracking-tight text-white">
                Trace
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                <Sparkles className="h-3 w-3 text-purple-400" />
                Instant browser workspace
              </p>
            </div>
          </Link>

          {/* CENTER: soft invisible spacer for symmetry */}
          <div className="hidden w-55 md:block" />

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/ansh-vaish/Web-IDE"
              target="blank"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm font-medium text-zinc-200 backdrop-blur-md transition-all duration-200 hover:border-purple-400/20 hover:bg-white/8 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.12)]"
            >
              GitHub
            </Link>

            {session?.user ? (
              <UserButton user={session.user} />
            ) : (
              <Link
                href="/auth/sign-in"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/4 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:border-white/15 hover:bg-white/8 shadow-[0_0_25px_rgba(168,85,247,0.08)]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
