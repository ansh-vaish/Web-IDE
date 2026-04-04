import { signIn } from "@/auth";
import { CursorGlitter } from "@/modules/home/CursorGlitter";
import { Code2, Github } from "lucide-react";

async function handleGoogleSignIn() {
  "use server";
  await signIn("google");
}

async function handleGithubSignIn() {
  "use server";
  await signIn("github");
}

export function SignInFormClient() {
  return (
    <div className="relative h-screen overflow-hidden bg-[#0b0b10] text-white">
      <CursorGlitter />

      {/* Global Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-80 w-[320px] rounded-full bg-violet-700/20 blur-3xl" />
        <div className="absolute right-[-10%] bottom-[-10%] h-80 w-[320px] rounded-full bg-fuchsia-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex h-full items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid h-[92vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/3 shadow-[0_25px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:grid-cols-2">
          {/* Left Side */}
          <div className="relative hidden lg:flex flex-col justify-between overflow-hidden border-r border-white/10 bg-linear-to-br from-violet-700/15 via-purple-700/10 to-transparent px-10 pb-10 pt-12 xl:px-12 xl:pb-12 xl:pt-14">
            {/* Background Image */}
            <div className="pointer-events-none absolute inset-0">
              <img
                src="/loginImage.svg"
                alt="Background Illustration"
                className="h-full w-full scale-110 object-cover opacity-[0.78] blur-[0.5px]"
              />
              <div className="absolute inset-0 bg-linear-to-br from-[#160d24]/90 via-[#130d1f]/78 to-[#0b0b10]/60" />
              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Top + Middle Content */}
            <div className="relative z-10 flex flex-col">
              <div className="mb-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Developer Workspace
              </div>

              <div className="max-w-130 pt-6">
                <h2 className="max-w-120 text-5xl font-semibold leading-[1.08] tracking-tight text-white xl:text-[4rem]">
                  Build, ship, and manage your code in one place.
                </h2>

                <p className="mt-7 max-w-107.5 text-[15px] leading-8 text-zinc-300/90">
                  Access your projects, continue your sessions, and get back to
                  building without friction.
                </p>
              </div>
            </div>

            {/* Bottom Text */}
            <div className="relative z-10 pt-8">
              <p className="text-sm font-medium tracking-wide text-zinc-400/90">
                Fast auth. Clean workspace. No nonsense.
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex h-full items-center justify-center px-6 py-8 sm:px-10 lg:px-14 xl:px-16">
            <div className="w-full max-w-md">
              {/* Brand */}
              <div className="mb-10 flex items-center justify-center lg:justify-start">
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium tracking-wide text-zinc-200 backdrop-blur-md">
                  YourIDE
                </div>
              </div>

              {/* Heading */}
              <div className="mb-9 text-center lg:text-left">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Welcome back
                </h1>
                <p className="mt-4 max-w-sm text-sm leading-7 text-zinc-400 lg:max-w-md">
                  Sign in to continue to your workspace and resume building.
                </p>
              </div>

              {/* OAuth Buttons */}
              <div className="space-y-4">
                {/* GitHub */}
                <form action={handleGithubSignIn}>
                  <button
                    type="submit"
                    className="group flex h-16 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/65 px-5 text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-500/50 hover:bg-zinc-800/80 hover:shadow-[0_12px_28px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b10]"
                  >
                    <Github className="h-5 w-5 text-zinc-300 transition-colors group-hover:text-white" />
                    <span className="text-sm font-medium tracking-wide">
                      Continue with GitHub
                    </span>
                  </button>
                </form>

                {/* Google */}
                <form action={handleGoogleSignIn}>
                  <button
                    type="submit"
                    className="group flex h-16 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/65 px-5 text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-500/50 hover:bg-zinc-800/80 hover:shadow-[0_12px_28px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b10]"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span className="text-sm font-medium tracking-wide">
                      Continue with Google
                    </span>
                  </button>
                </form>
              </div>

              {/* Footer */}
              <p className="mt-10 text-center text-xs leading-6 text-zinc-500 lg:text-left">
                By continuing, you agree to our Terms and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInFormClient;
