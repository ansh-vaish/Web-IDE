"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import {
  Code2,
  Github,
  Play,
  Zap,
  Globe,
  Terminal,
  Box,
  Layers,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

import UserButton from "@/modules/auth/components/user-button";

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    document.documentElement.classList.add("dark");

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-black text-white flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.05),transparent_50%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[100px_100px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.03),transparent_40%)]" />
      </div>

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-360 mx-auto px-6 lg:px-10 py-5">
          <div className="grid grid-cols-3 items-center">
            {/* Logo */}
            <div className="flex items-center gap-3 justify-self-start">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
                <Terminal className="w-5 h-5 text-black" />
              </div>

              <span className="text-xl font-semibold tracking-tight">
                Trace
              </span>
            </div>

            {/* Center Nav */}
            <div className="hidden md:flex items-center justify-center gap-10 justify-self-center"></div>

            {/* Right */}
            <div className="flex items-center gap-3 justify-self-end">
              <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/2 hover:bg-white/5 transition-all">
                <Github className="w-4 h-4" />

                <a
                  href="https://github.com/ansh-vaish/Web-IDE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm"
                >
                  GitHub
                </a>
              </button>

              {session?.user ? (
                <UserButton user={session.user} />
              ) : (
                <Link
                  href="/auth/sign-in"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white px-6 py-2.5 text-sm font-medium text-black transition hover:bg-gray-200"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex-1 px-8 pt-24 flex items-center">
        <div className="max-w-360 mx-auto w-full">
          <div className="grid lg:grid-cols-[1fr_620px] gap-16 xl:gap-20 items-center">
            {/* Left */}
            <div className="space-y-8 max-w-160">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/3 border border-white/10 mb-8">
                  <Sparkles className="w-3 h-3 text-gray-400" />

                  <span className="text-sm text-gray-400 tracking-tight">
                    Instant Cloud Development
                  </span>
                </div>

                <h1 className="font-serif text-[54px] md:text-[68px] xl:text-[78px] leading-[0.92] tracking-[-0.04em] font-semibold text-white mb-6">
                  Code instantly.
                  <br />
                  Ship without
                  <br />
                  setup.
                </h1>

                <p className="text-lg md:text-[22px] leading-normal text-gray-400 max-w-155 font-light tracking-tight">
                  Launch full-stack development environments in seconds. No
                  configuration, no installations—just open your browser and
                  start coding.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-4 pt-1"
              >
                <button className="flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black hover:bg-gray-200 transition-all text-base font-medium">
                  <a href="/dashboard" className="flex items-center gap-2">
                    Launch Workspace
                  </a>

                  <Play className="w-4 h-4" />
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-8 pt-4"
              >
                {[
                  { icon: Zap, text: "No setup" },
                  { icon: Globe, text: "Runs in browser" },
                  { icon: Github, text: "Import Repo" },
                  { icon: Code2, text: "Zero config" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-gray-600" />

                    <span className="text-base text-gray-500 tracking-tight">
                      {item.text}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative w-full max-w-165 mx-auto lg:mx-0"
            >
              <div className="relative">
                {/* IDE */}
                <div className="relative h-145 bg-linear-to-br from-zinc-900 to-black rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                  {/* Topbar */}
                  <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-white/20" />
                      <div className="w-3 h-3 rounded-full bg-white/20" />
                      <div className="w-3 h-3 rounded-full bg-white/20" />
                    </div>

                    <div className="flex-1 text-center text-sm text-gray-500">
                      anshvaish.tech/playground/react-app
                    </div>
                  </div>

                  <div className="flex h-111.25">
                    {/* Sidebar */}
                    <div className="w-16 bg-black/40 border-r border-white/10 p-3 space-y-5">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <Box className="w-4 h-4" />
                      </div>

                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600">
                        <Layers className="w-4 h-4" />
                      </div>

                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600">
                        <Terminal className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Editor */}
                    <div className="flex-1 p-8 font-mono text-[15px] overflow-hidden bg-black text-white">
                      <div className="space-y-0.1 leading-8">
                        <div>
                          <span className="text-[#c792ea]">import</span>{" "}
                          <span className="text-[#4ec9b0]">React</span>{" "}
                          <span className="text-[#c792ea]">from</span>{" "}
                          <span className="text-[#ce9178]">'react'</span>;
                        </div>

                        <div>
                          <span className="text-[#c792ea]">import</span>{" "}
                          <span className="text-[#ce9178]">'./style.css'</span>;
                        </div>

                        <div className="h-3" />

                        <div>
                          <span className="text-[#c792ea]">
                            export default function
                          </span>{" "}
                          <span className="text-[#4ec9b0]">App</span>()
                          {" {"}
                        </div>

                        <div className="pl-6">
                          <span className="text-[#c792ea]">return</span> (
                        </div>

                        <div className="pl-12">
                          {"<"}
                          <span className="text-[#569cd6]">div</span>
                          {">"}
                        </div>

                        <div className="pl-20">
                          {"<"}
                          <span className="text-[#569cd6]">h1</span>
                          {">"}
                          <span className="text-[#4ec9b0]">React Starter!</span>
                          {"</"}
                          <span className="text-[#569cd6]">h1</span>
                          {">"}
                        </div>

                        <div className="pl-20">
                          {"<"}
                          <span className="text-[#569cd6]">p</span>
                          {">"}
                          Start editing to see some magic happen :)
                          {"</"}
                          <span className="text-[#569cd6]">p</span>
                          {">"}
                        </div>

                        <div className="pl-12">
                          {"</"}
                          <span className="text-[#569cd6]">div</span>
                          {">"}
                        </div>

                        <div className="pl-6">);</div>

                        <div>{"}"}</div>
                      </div>
                    </div>
                  </div>

                  {/* Terminal */}
                  <div className="border-t border-white/10 bg-black/60 p-5 font-mono text-xs h-20">
                    <div className="text-green-400">$ npm run dev</div>

                    <div className="text-gray-500 mt-1">✓ Ready in 247ms</div>
                  </div>
                </div>

                {/* Floating Card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="absolute -right-4 top-8 bg-black border border-white/15 rounded-2xl px-6 py-4 shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />

                    <span className="text-sm text-gray-300">Live Preview</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 px-6 py-4 shrink-0">
        <div className="max-w-360 mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center">
              <Terminal className="w-3 h-3 text-black" />
            </div>

            <span className="text-sm text-gray-400">Trace</span>
          </div>

          <p className="text-xs text-gray-600">© 2026</p>
        </div>
      </footer>
    </div>
  );
}
