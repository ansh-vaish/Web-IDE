"use client";

import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  return (
    <section className="relative h-full overflow-hidden">
      {/* === BACKGROUND (MATCH LOGIN PAGE) === */}
      <div className="absolute inset-0">
        {/* purple glow */}
        <div className="left-1/2 -translate-x-1/2 w-200 h-200 bg-purple-700/20 blur-[160px] rounded-full" />

        {/* bottom ambient */}
        <div className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-225 h-150 bg-indigo-600/10 blur-[140px] rounded-full" />

        {/* subtle noise overlay feel */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_70%)]" />
      </div>

      {/* === CONTENT === */}
      <div className="relative h-full px-6 lg:px-10 py-10 flex flex-col justify-center">
        <div className="max-w-5xl mx-auto text-center">
          {/* Heading */}
          <h1 className="text-5xl lg:text-6xl font-semibold leading-tight mb-6">
            <span className="text-white">Start building instantly</span>
            <br />
            <span className="text-gray-400">no setup, no friction</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Launch full development environments in your browser. Choose a
            stack, spin up instantly, and start Working.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14">
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-white hover:bg-gray-200 text-black px-8 py-3 rounded-xl font-medium transition"
            >
              Launch Workspace
            </button>

            <button className="border border-zinc-700 hover:border-zinc-500 text-white px-8 py-3 rounded-xl transition backdrop-blur-md">
              Explore Templates →
            </button>
          </div>
        </div>

        {/* === HERO IDE (MATCHES YOUR REAL UI) === */}


        {/* === VALUE STRIP (REPLACES EMPTY FOOTER FEEL) === */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <span>⚡ Instant setup</span>
          <span>🧩 Multiple frameworks</span>
          <span>☁️ Browser-based IDE</span>
          <span>🚀 Zero config</span>
        </div>
      </div>
    </section>
  );
};

export default Home;
