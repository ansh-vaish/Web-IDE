"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/modules/auth/actions";
import { revalidatePath } from "next/cache";

type PlaygroundTemplate =
  | "REACT"
  | "NEXTJS"
  | "EXPRESS"
  | "VUE"
  | "ANGULAR"
  | "HONO";

type GithubRepo = {
  id: number;
  full_name: string;
  name: string;
  private: boolean;
  default_branch: string;
  description: string | null;
};

type GithubTreeNode = {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
};

type TemplateFileNode = {
  filename: string;
  fileExtension: string;
  content: string;
};

type TemplateFolderNode = {
  folderName: string;
  items: Array<TemplateFileNode | TemplateFolderNode>;
};

const GITHUB_API = "https://api.github.com";
const IGNORED_FOLDERS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "coverage",
]);
const IGNORED_FILES = new Set([
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lockb",
]);
const MAX_BLOB_SIZE = 200_000;
const MAX_FILES = 80;

class GithubApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "GithubApiError";
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}

function parseOwnerAndRepo(input: string): { owner: string; repo: string } {
  const cleaned = input.trim();

  if (!cleaned) {
    throw new Error("Repository is required");
  }

  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
    const url = new URL(cleaned);
    const parts = url.pathname.replace(/^\/+|\/+$/g, "").split("/");
    if (parts.length < 2) {
      throw new Error("Invalid GitHub repository URL");
    }
    return { owner: parts[0], repo: parts[1].replace(/\.git$/, "") };
  }

  const [owner, repoRaw] = cleaned.split("/");
  if (!owner || !repoRaw) {
    throw new Error("Use owner/repo or full GitHub URL");
  }

  return { owner, repo: repoRaw.replace(/\.git$/, "") };
}

async function getGithubAccessTokenOptional(
  userId: string,
): Promise<string | null> {
  const account = await db.account.findFirst({
    where: {
      userId,
      provider: "github",
    },
    select: { access_token: true },
  });

  return account?.access_token ?? null;
}

async function getGithubAccessToken(userId: string): Promise<string> {
  const accessToken = await getGithubAccessTokenOptional(userId);
  if (!accessToken) {
    throw new Error("GitHub account is not connected or token is missing");
  }

  return accessToken;
}

async function githubFetch<T>(endpoint: string, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${GITHUB_API}${endpoint}`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new GithubApiError(
      response.status,
      `GitHub request failed (${response.status}): ${body}`,
    );
  }

  return (await response.json()) as T;
}

function shouldSkipPath(pathValue: string): boolean {
  const segments = pathValue.split("/");
  const filename = segments[segments.length - 1];
  if (IGNORED_FILES.has(filename)) {
    return true;
  }
  return segments.some((segment) => IGNORED_FOLDERS.has(segment));
}

function insertFile(
  root: TemplateFolderNode,
  filePath: string,
  content: string,
): void {
  const segments = filePath.split("/");
  const rawName = segments.pop();
  if (!rawName) return;

  let current: TemplateFolderNode = root;
  for (const segment of segments) {
    const existing = current.items.find(
      (item): item is TemplateFolderNode =>
        "folderName" in item && item.folderName === segment,
    );

    if (existing) {
      current = existing;
      continue;
    }

    const next: TemplateFolderNode = { folderName: segment, items: [] };
    current.items.push(next);
    current = next;
  }

  const lastDot = rawName.lastIndexOf(".");
  const hasExtension = lastDot > 0;
  const filename = hasExtension ? rawName.slice(0, lastDot) : rawName;
  const fileExtension = hasExtension ? rawName.slice(lastDot + 1) : "";

  current.items.push({ filename, fileExtension, content });
}

function detectTemplate(nodes: GithubTreeNode[]): PlaygroundTemplate {
  const paths = new Set(nodes.map((node) => node.path));

  if (
    paths.has("next.config.js") ||
    paths.has("next.config.ts") ||
    paths.has("next.config.mjs")
  ) {
    return "NEXTJS";
  }

  if (paths.has("angular.json")) {
    return "ANGULAR";
  }

  if (paths.has("hono.ts") || paths.has("hono.config.ts")) {
    return "HONO";
  }

  if (paths.has("vite.config.ts") || paths.has("vite.config.js")) {
    return "REACT";
  }

  return "REACT";
}

export const getGithubRepositories = async () => {
  const user = await currentUser();
  if (!user?.id) {
    return { error: "UNAUTHENTICATED" };
  }

  try {
    const token = await getGithubAccessToken(user.id);
    const repos = await githubFetch<GithubRepo[]>(
      "/user/repos?sort=updated&per_page=100",
      token,
    );

    return repos.map((repo) => ({
      id: repo.id,
      fullName: repo.full_name,
      name: repo.name,
      isPrivate: repo.private,
      defaultBranch: repo.default_branch,
      description: repo.description,
    }));
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const importGithubRepository = async (repoInput: string) => {
  const user = await currentUser();
  if (!user?.id) {
    return { error: "UNAUTHENTICATED" };
  }

  const token = await getGithubAccessTokenOptional(user.id);
  let owner = "";
  let repo = "";

  try {
    const parsed = parseOwnerAndRepo(repoInput);
    owner = parsed.owner;
    repo = parsed.repo;
  } catch (error) {
    return { error: getErrorMessage(error) };
  }

  let repoDetails: GithubRepo;
  try {
    repoDetails = await githubFetch<GithubRepo>(
      `/repos/${owner}/${repo}`,
      token ?? undefined,
    );
  } catch (error) {
    if (error instanceof GithubApiError && error.status === 404 && !token) {
      return {
        error:
          "Repository not found or private. Connect GitHub to import private repositories.",
      };
    }

    if (error instanceof GithubApiError && error.status === 403 && !token) {
      return {
        error:
          "GitHub API rate limit reached for anonymous access. Connect GitHub and try again.",
      };
    }

    return { error: getErrorMessage(error) };
  }

  let treeResponse: { tree: GithubTreeNode[] };
  try {
    treeResponse = await githubFetch<{ tree: GithubTreeNode[] }>(
      `/repos/${owner}/${repo}/git/trees/${repoDetails.default_branch}?recursive=1`,
      token ?? undefined,
    );
  } catch (error) {
    return { error: getErrorMessage(error) };
  }

  const fileNodes = treeResponse.tree
    .filter((node) => node.type === "blob")
    .filter((node) => !shouldSkipPath(node.path))
    .filter((node) => (node.size ?? 0) <= MAX_BLOB_SIZE)
    .slice(0, MAX_FILES);

  if (fileNodes.length === 0) {
    return { error: "No importable files found in this repository" };
  }

  const templateRoot: TemplateFolderNode = {
    folderName: repoDetails.name,
    items: [],
  };

  for (const node of fileNodes) {
    let blob: { content?: string; encoding?: string };
    try {
      blob = await githubFetch<{ content?: string; encoding?: string }>(
        `/repos/${owner}/${repo}/git/blobs/${node.sha}`,
        token ?? undefined,
      );
    } catch {
      continue;
    }

    if (!blob.content || blob.encoding !== "base64") {
      continue;
    }

    const decoded = Buffer.from(
      blob.content.replace(/\n/g, ""),
      "base64",
    ).toString("utf8");

    // Skip binary files represented as non-text payloads.
    if (decoded.includes("\u0000")) {
      continue;
    }

    insertFile(templateRoot, node.path, decoded);
  }

  if (templateRoot.items.length === 0) {
    return {
      error: "Repository does not contain text files that can be imported",
    };
  }

  const template = detectTemplate(fileNodes);
  try {
    const newPlayground = await db.playground.create({
      data: {
        title: repoDetails.full_name,
        description: repoDetails.description ?? "Imported from GitHub",
        template,
        userId: user.id,
        templateFiles: {
          create: {
            content: JSON.stringify(templateRoot),
          },
        },
      },
      select: { id: true },
    });

    revalidatePath("/dashboard");
    return newPlayground;
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const getAllPlaygroundsOfUser = async () => {
  const user = await currentUser();
  try {
    const playgrounds = await db.playground.findMany({
      where: { userId: user?.id },
      include: {
        user: true,
        Starmark: {
          where: { userId: user?.id },
          select: { isMarked: true },
        },
      },
    });

    return playgrounds;
  } catch (error) {
    console.error("Error fetching playgrounds", error);
  }
};

export const createPlayground = async (data: {
  title: string;
  template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
  description?: string;
}) => {
  const user = await currentUser();
  const { title, template, description } = data;
  try {
    const newPlayground = await db.playground.create({
      data: {
        title: title,
        template: template,
        description: description,
        userId: user?.id!,
      },
    });

    return newPlayground;
  } catch (error) {
    console.error("Error creating playground", error);
  }
};

export const deletePlaygroundById = async (id: string) => {
  try {
    await db.playground.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error deleting playground", error);
  }
};

export const updatePlaygroundById = async (
  id: string,
  data: { title?: string; description?: string },
) => {
  const { title, description } = data;
  try {
    await db.playground.update({
      where: { id },
      data: { title, description },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error updating playground", error);
  }
};

export const duplicatePlaygroundById = async (id: string) => {
  try {
    const originalPlayground = await db.playground.findUnique({
      where: { id },
      // todo
    });
    if (!originalPlayground) {
      return { error: "Playground not found" };
    }
    const duplicatedPlayground = await db.playground.create({
      data: {
        title: originalPlayground.title + " (Copy)",
        template: originalPlayground.template,
        description: originalPlayground.description,
        userId: originalPlayground.userId,
      },
    });
    revalidatePath("/dashboard");
    return duplicatedPlayground;
  } catch (error) {
    console.error("Error duplicating playground", error);
  }
};

export const toggleStarMarked = async (id: string, isMarked: boolean) => {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) {
    return { success: false, error: "User not authenticated", isMarked };
  }
  try {
    if (isMarked) {
      await db.starMark.create({
        data: {
          userId,
          playgroundId: id,
          isMarked,
        },
      });
    } else {
      await db.starMark.delete({
        where: {
          userId_playgroundId: {
            userId,
            playgroundId: id,
          },
        },
      });
    }
    revalidatePath("/dashboard");
    return { success: true, isMarked };
  } catch (error) {
    console.error("Error toggling star mark", error);
    return { success: false, error, isMarked: !isMarked };
  }
};
