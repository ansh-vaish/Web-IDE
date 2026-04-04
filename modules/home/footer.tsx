import { Code2, Sparkles } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative border-t border-white/5 bg-linear-to-r from-black via-zinc-950/40 to-black backdrop-blur-xl px-6 md:px-8 py-4 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
        <div className="h-20 w-125 bg-purple-500/10 blur-[80px] rounded-full" />
      </div>

      {/* Top soft line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl border border-white/10 bg-white/3 flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.08)]">
            <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-purple-500/10 via-transparent to-indigo-500/10" />
            <Code2 className="relative w-5 h-5 text-white" />
          </div>

          <div className="leading-tight">
            <p className="text-sm font-medium text-zinc-200">
              Build faster with pre-configured dev environments.
            </p>
            <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              Launch projects instantly, right from your browser.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="https://github.com/ansh-vaish?tab=repositories"
            target="blank"
            className="rounded-full px-4 py-2 text-white hover:text-white hover:bg-white/4 transition"
          >
            Docs
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
