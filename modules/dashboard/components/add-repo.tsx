"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowDown, Github } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { getGithubRepositories, importGithubRepository } from "../actions";

type RepoOption = {
  id: number;
  fullName: string;
  name: string;
  isPrivate: boolean;
  description: string | null;
};

const AddRepo = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [repos, setRepos] = useState<RepoOption[]>([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [manualRepo, setManualRepo] = useState("");
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const resolvedRepoInput = useMemo(() => {
    if (manualRepo.trim()) {
      return manualRepo.trim();
    }
    return selectedRepo;
  }, [manualRepo, selectedRepo]);

  const handleOpen = async () => {
    setIsOpen(true);

    if (repos.length > 0) {
      return;
    }

    try {
      setIsLoadingRepos(true);
      const response = await getGithubRepositories();
      setRepos(response);

      if (response.length > 0) {
        setSelectedRepo(response[0].fullName);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load repositories";
      toast.error(message);
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const handleImport = async () => {
    if (!resolvedRepoInput) {
      toast.error("Select a repository or enter owner/repo");
      return;
    }

    try {
      setIsImporting(true);
      const imported = await importGithubRepository(resolvedRepoInput);
      toast.success("Repository imported successfully");
      setIsOpen(false);
      router.refresh();
      router.push(`/playground/${imported.id}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to import repository right now";
      toast.error(message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <div
        onClick={handleOpen}
        className="group relative flex h-full min-h-46 w-full cursor-pointer flex-row items-center justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/55 px-6 py-6 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-zinc-600 hover:bg-zinc-900/80"
      >
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Import From GitHub</DialogTitle>
            <div className="mt-4 text-sm text-purple-300 border border-purple-500/20 bg-purple-500/5 px-4 py-2 rounded-lg">
              ⚠️ Currently only Node.js environment is supported. Support for
              more environments is coming soon.
            </div>
            <DialogDescription>
              Select one of your repositories, or paste owner/repo to import a
              public repository without GitHub login.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-zinc-400">Your repositories</p>
              <select
                className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100"
                disabled={isLoadingRepos || repos.length === 0}
                value={selectedRepo}
                onChange={(event) => {
                  setSelectedRepo(event.target.value);
                  if (manualRepo.trim()) {
                    setManualRepo("");
                  }
                }}
              >
                {repos.length === 0 ? (
                  <option value="">No repositories found</option>
                ) : (
                  repos.map((repo) => (
                    <option key={repo.id} value={repo.fullName}>
                      {repo.fullName}
                      {repo.isPrivate ? " (private)" : ""}
                    </option>
                  ))
                )}
              </select>
              {isLoadingRepos && (
                <p className="text-xs text-zinc-400">Loading repositories...</p>
              )}
              {!isLoadingRepos && repos.length === 0 && (
                <p className="text-xs text-zinc-500">
                  Connect GitHub to list your repositories here.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-zinc-400">Import any public repo</p>
              <Input
                placeholder="owner/repo or https://github.com/owner/repo"
                value={manualRepo}
                onChange={(event) => setManualRepo(event.target.value)}
              />
              <p className="text-xs text-zinc-500">
                Private repos require GitHub account connection.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isImporting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleImport}
              disabled={isImporting || isLoadingRepos}
            >
              {isImporting ? "Importing..." : "Import Repository"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddRepo;
