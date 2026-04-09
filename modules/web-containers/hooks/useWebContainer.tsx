import { useState, useEffect, useCallback } from "react";
import { WebContainer } from "@webcontainer/api";
import { TemplateFolder } from "@/modules/playground/lib/path-to-json";

let sharedWebContainerInstance: WebContainer | null = null;
let sharedWebContainerBootPromise: Promise<WebContainer> | null = null;

async function getOrBootWebContainer(): Promise<WebContainer> {
  if (sharedWebContainerInstance) {
    return sharedWebContainerInstance;
  }

  if (!sharedWebContainerBootPromise) {
    sharedWebContainerBootPromise = WebContainer.boot()
      .then((instance) => {
        sharedWebContainerInstance = instance;
        return instance;
      })
      .catch((error) => {
        sharedWebContainerBootPromise = null;
        throw error;
      });
  }

  return sharedWebContainerBootPromise;
}

function teardownSharedWebContainer(): void {
  if (sharedWebContainerInstance) {
    sharedWebContainerInstance.teardown();
  }

  sharedWebContainerInstance = null;
  sharedWebContainerBootPromise = null;
}

interface UseWebContainerProps {
  templateData: TemplateFolder;
}

interface UseWebContaierReturn {
  serverUrl: string | null;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  destory: () => void;
}

export const useWebContainer = ({
  templateData,
}: UseWebContainerProps): UseWebContaierReturn => {
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(
    !sharedWebContainerInstance,
  );
  const [error, setError] = useState<string | null>(null);
  const [instance, setInstance] = useState<WebContainer | null>(
    sharedWebContainerInstance,
  );

  useEffect(() => {
    let isCancelled = false;

    async function initializeWebContainer() {
      try {
        const webcontainerInstance = await getOrBootWebContainer();

        if (isCancelled) return;

        setInstance(webcontainerInstance);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize WebContainer:", error);
        if (!isCancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to initialize WebContainer",
          );
          setIsLoading(false);
        }
      }
    }

    initializeWebContainer();

    return () => {
      isCancelled = true;
    };
  }, []);

  const writeFileSync = useCallback(
    async (path: string, content: string): Promise<void> => {
      if (!instance) {
        throw new Error("WebContainer instance is not available");
      }

      try {
        const pathParts = path.split("/");
        const folderPath = pathParts.slice(0, -1).join("/");

        if (folderPath) {
          await instance.fs.mkdir(folderPath, { recursive: true }); // Create folder structure recursively
        }

        await instance.fs.writeFile(path, content);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to write file";
        console.error(`Failed to write file at ${path}:`, err);
        throw new Error(`Failed to write file at ${path}: ${errorMessage}`);
      }
    },
    [instance],
  );

  const destory = useCallback(() => {
    teardownSharedWebContainer();
    setInstance(null);
    setServerUrl(null);
  }, []);

  return { serverUrl, isLoading, error, instance, writeFileSync, destory };
};
