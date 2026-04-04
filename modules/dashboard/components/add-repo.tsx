import { Button } from "@/components/ui/button";
import { ArrowDown, Github } from "lucide-react";
import Image from "next/image";

const AddRepo = () => {
  return (
    <div className="group relative flex h-full min-h-46 w-full cursor-pointer flex-row items-center justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/55 px-6 py-6 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-zinc-600 hover:bg-zinc-900/80">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 85% 15%, rgba(161,161,170,0.17) 0%, transparent 52%)",
        }}
      />

      <div className="flex flex-row justify-center items-start gap-4">
        <Button
          variant={"outline"}
          className="flex items-center justify-center border-zinc-700 bg-black/60 text-zinc-200 transition-colors duration-300 group-hover:border-zinc-500 group-hover:text-white"
          size={"icon"}
        >
          <ArrowDown
            size={22}
            className="transition-transform duration-300 group-hover:translate-y-1"
          />
        </Button>
        <div className="flex flex-col">
          <div className="mb-1 inline-flex w-fit items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800/70 px-2 py-0.5 text-[11px] tracking-wide text-zinc-300 uppercase">
            <Github className="h-3 w-3" />
            Import
          </div>
          <h1 className="text-xl font-semibold text-zinc-100">
            Open GitHub Repository
          </h1>
          <p className="max-w-55 text-sm text-zinc-400">
            Work with your repositories in our editor
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden opacity-85 transition-opacity duration-300 group-hover:opacity-100">
        <Image
          src="/github.svg"
          alt="Open GitHub repository"
          width={150}
          height={150}
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </div>
  );
};

export default AddRepo;
