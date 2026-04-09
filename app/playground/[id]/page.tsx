"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LoadingStep from "@/modules/playground/components/loader";
import PlaygroundEditor from "@/modules/playground/components/playground-editor";
import { TemplateFileTree } from "@/modules/playground/components/playground-explorer";
// import ToggleAI from "@/modules/playground/components/toggle-ai";
// import { useAISuggestions } from "@/modules/playground/hooks/useAISuggestion";
import { useFileExplorer } from "@/modules/playground/hooks/useFileExplorer";
import { usePlayground } from "@/modules/playground/hooks/usePlayground";
import { findFilePath } from "@/modules/playground/lib";
import {
  TemplateFile,
  TemplateFolder,
} from "@/modules/playground/lib/path-to-json";
import WebContainerPreview from "@/modules/web-containers/components/webcontainer-preview";
import { useWebContainer } from "@/modules/web-containers/hooks/useWebContainer";
import {
  AlertCircle,
  Bot,
  FileText,
  FolderOpen,
  LogOut,
  Save,
  Settings,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

const MainPlaygroundPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  // resizable panels
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [previewWidth, setPreviewWidth] = useState(40); // percent
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const newPreviewWidth = ((rect.width - offsetX) / rect.width) * 100;

      const clamped = Math.min(70, Math.max(20, newPreviewWidth));
      setPreviewWidth(clamped);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const startDragging = () => {
    isDraggingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const editorWidth = isPreviewVisible ? 100 - previewWidth : 100;

  const { playgroundData, templateData, isLoading, error, saveTemplateData } =
    usePlayground(id);

  // const aiSuggestions = useAISuggestions();

  const {
    setTemplateData,
    setActiveFileId,
    setPlaygroundId,
    setOpenFiles,
    activeFileId,
    closeAllFiles,
    closeFile,
    openFile,
    openFiles,

    handleAddFile,
    handleAddFolder,
    handleDeleteFile,
    handleDeleteFolder,
    handleRenameFile,
    handleRenameFolder,
    updateFileContent,
  } = useFileExplorer();

  const {
    serverUrl,
    isLoading: containerLoading,
    error: containerError,
    instance,
    writeFileSync,
    destory,
    // @ts-ignore
  } = useWebContainer({ templateData });

  const lastSyncedContent = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    setPlaygroundId(id);
  }, [id, setPlaygroundId]);

  useEffect(() => {
    if (templateData && !openFiles.length) {
      setTemplateData(templateData);
    }
  }, [templateData, setTemplateData, openFiles.length]);

  // Create wrapper functions that pass saveTemplateData
  const wrappedHandleAddFile = useCallback(
    (newFile: TemplateFile, parentPath: string) => {
      return handleAddFile(
        newFile,
        parentPath,
        writeFileSync!,
        instance,
        saveTemplateData,
      );
    },
    [handleAddFile, writeFileSync, instance, saveTemplateData],
  );

  const wrappedHandleAddFolder = useCallback(
    (newFolder: TemplateFolder, parentPath: string) => {
      return handleAddFolder(newFolder, parentPath, instance, saveTemplateData);
    },
    [handleAddFolder, instance, saveTemplateData],
  );

  const wrappedHandleDeleteFile = useCallback(
    (file: TemplateFile, parentPath: string) => {
      return handleDeleteFile(file, parentPath, saveTemplateData);
    },
    [handleDeleteFile, saveTemplateData],
  );

  const wrappedHandleDeleteFolder = useCallback(
    (folder: TemplateFolder, parentPath: string) => {
      return handleDeleteFolder(folder, parentPath, saveTemplateData);
    },
    [handleDeleteFolder, saveTemplateData],
  );

  const wrappedHandleRenameFile = useCallback(
    (
      file: TemplateFile,
      newFilename: string,
      newExtension: string,
      parentPath: string,
    ) => {
      return handleRenameFile(
        file,
        newFilename,
        newExtension,
        parentPath,
        saveTemplateData,
      );
    },
    [handleRenameFile, saveTemplateData],
  );

  const wrappedHandleRenameFolder = useCallback(
    (folder: TemplateFolder, newFolderName: string, parentPath: string) => {
      return handleRenameFolder(
        folder,
        newFolderName,
        parentPath,
        saveTemplateData,
      );
    },
    [handleRenameFolder, saveTemplateData],
  );

  const activeFile = openFiles.find((file) => file.id === activeFileId);
  const hasUnsavedChanges = openFiles.some((file) => file.hasUnsavedChanges);

  const handleFileSelect = (file: TemplateFile) => {
    openFile(file);
  };

  const handleSave = useCallback(
    async (fileId?: string) => {
      const targetFileId = fileId || activeFileId;
      if (!targetFileId) return;

      const latestOpenFiles = useFileExplorer.getState().openFiles;
      const fileToSave = latestOpenFiles.find((f) => f.id === targetFileId);
      if (!fileToSave) return;

      const latestTemplateData = useFileExplorer.getState().templateData;
      if (!latestTemplateData) return;

      try {
        const filePath = findFilePath(fileToSave, latestTemplateData);
        if (!filePath) {
          toast.error(
            `Could not find path for file: ${fileToSave.filename}.${fileToSave.fileExtension}`,
          );
          return;
        }

        const baseFileName = `${fileToSave.filename}.${fileToSave.fileExtension}`;
        const normalizedIdPath = fileToSave.id.replace(/^\/+/, "");
        const trimmedIdPath = normalizedIdPath.endsWith(`/${baseFileName}`)
          ? normalizedIdPath.slice(0, -(baseFileName.length + 1))
          : normalizedIdPath;
        const hasDuplicatedSuffix =
          normalizedIdPath.endsWith(`/${baseFileName}`) &&
          trimmedIdPath.endsWith(baseFileName);
        const idBasedPath = hasDuplicatedSuffix
          ? trimmedIdPath
          : normalizedIdPath;

        const candidatePaths = Array.from(
          new Set([idBasedPath, filePath].filter(Boolean)),
        ) as string[];

        const updatedTemplateData = JSON.parse(
          JSON.stringify(latestTemplateData),
        );

        // @ts-ignore
        const updateFileContent = (items: any[]) =>
          // @ts-ignore
          items.map((item) => {
            if ("folderName" in item) {
              return { ...item, items: updateFileContent(item.items) };
            } else if (
              item.filename === fileToSave.filename &&
              item.fileExtension === fileToSave.fileExtension
            ) {
              return { ...item, content: fileToSave.content };
            }
            return item;
          });

        updatedTemplateData.items = updateFileContent(
          updatedTemplateData.items,
        );

        if (writeFileSync) {
          for (const candidatePath of candidatePaths) {
            await writeFileSync(candidatePath, fileToSave.content);
          }
          lastSyncedContent.current.set(fileToSave.id, fileToSave.content);
        }

        await saveTemplateData(updatedTemplateData);
        setTemplateData(updatedTemplateData);

        const latestOpenFilesAfterSave = useFileExplorer.getState().openFiles;
        const updatedOpenFiles = latestOpenFilesAfterSave.map((f) =>
          f.id === targetFileId
            ? {
                ...f,
                content: fileToSave.content,
                originalContent: fileToSave.content,
                hasUnsavedChanges: false,
              }
            : f,
        );
        setOpenFiles(updatedOpenFiles);

        toast.success(
          `Saved ${fileToSave.filename}.${fileToSave.fileExtension}`,
        );
      } catch (error) {
        console.error("Error saving file:", error);
        toast.error(
          `Failed to save ${fileToSave.filename}.${fileToSave.fileExtension}`,
        );
        throw error;
      }
    },
    [
      activeFileId,
      writeFileSync,
      instance,
      saveTemplateData,
      setTemplateData,
      setOpenFiles,
    ],
  );

  const handleSaveAll = useCallback(async () => {
    const unsavedFiles = openFiles.filter((f) => f.hasUnsavedChanges);

    if (unsavedFiles.length === 0) {
      toast.info("No unsaved changes");
      return;
    }

    let savedCount = 0;

    try {
      // Save sequentially to avoid concurrent state and persistence races.
      for (const file of unsavedFiles) {
        await handleSave(file.id);
        savedCount++;
      }

      toast.success(`Saved ${savedCount} file(s)`);
    } catch (error) {
      toast.error(`Saved ${savedCount} file(s), but some files failed`);
    }
  }, [openFiles, handleSave]);

  const handleExitPlayground = useCallback(() => {
    destory();
    closeAllFiles();
    router.push("/dashboard");
  }, [destory, closeAllFiles, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const hasModifier = e.ctrlKey || e.metaKey;

      if (!hasModifier) {
        return;
      }

      if (key === "p") {
        e.preventDefault();
        setIsPreviewVisible((prev) => !prev);
        return;
      }

      if (key !== "s") {
        return;
      }

      e.preventDefault();

      if (e.shiftKey) {
        handleSaveAll();
        return;
      }

      handleSave();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSave, handleSaveAll]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="destructive">
          Try Again
        </Button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Loading Playground
          </h2>
          <div className="mb-8">
            <LoadingStep
              currentStep={1}
              step={1}
              label="Loading playground data"
            />
            <LoadingStep
              currentStep={2}
              step={2}
              label="Setting up environment"
            />
            <LoadingStep currentStep={3} step={3} label="Ready to code" />
          </div>
        </div>
      </div>
    );
  }

  // No template data
  if (!templateData) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <FolderOpen className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold text-amber-600 mb-2">
          No template data available
        </h2>
        <Button onClick={() => window.location.reload()} variant="outline">
          Reload Template
        </Button>
      </div>
    );
  }

return (
  <TooltipProvider>
    <>
      <TemplateFileTree
        data={templateData!}
        onFileSelect={handleFileSelect}
        selectedFile={activeFile}
        title="File Explorer"
        onAddFile={wrappedHandleAddFile}
        onAddFolder={wrappedHandleAddFolder}
        onDeleteFile={wrappedHandleDeleteFile}
        onDeleteFolder={wrappedHandleDeleteFolder}
        onRenameFile={wrappedHandleRenameFile}
        onRenameFolder={wrappedHandleRenameFolder}
      />

      <SidebarInset className="h-screen overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/60 bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          <div className="flex flex-1 items-center gap-2">
            <div className="flex flex-1 flex-col">
              <h1 className="text-sm font-medium tracking-tight">
                {playgroundData?.title || "Code Playground"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {openFiles.length} File(s) Open
                {hasUnsavedChanges && " • Unsaved changes"}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSave()}
                    disabled={!activeFile || !activeFile.hasUnsavedChanges}
                    className="h-8 px-2"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save (Ctrl+S)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSaveAll}
                    disabled={!hasUnsavedChanges}
                    className="h-8 px-2"
                  >
                    <Save className="h-4 w-4" /> All
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save All (Ctrl+Shift+S)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleExitPlayground}
                    className="h-8 px-2"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Exit Playground</TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className="h-8 px-2">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                  >
                    {isPreviewVisible ? "Hide" : "Show"} Preview
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={closeAllFiles}>
                    Close All Files
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
          {/* Tabs */}
          <div className="shrink-0 border-b border-border/60 bg-muted/20 backdrop-blur-sm">
            <Tabs value={activeFileId || ""} onValueChange={setActiveFileId}>
              <div className="flex items-center justify-between px-4 py-2">
                <TabsList className="h-9 bg-transparent p-0">
                  {openFiles.map((file) => (
                    <TabsTrigger
                      key={file.id}
                      value={file.id}
                      className="group relative h-8 rounded-md px-3 text-sm data-[state=active]:bg-background/80 data-[state=active]:shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="max-w-[160px] truncate">
                          {file.filename}.{file.fileExtension}
                        </span>

                        {file.hasUnsavedChanges && (
                          <span className="h-2 w-2 rounded-full bg-orange-500" />
                        )}

                        <span
                          className="ml-1 flex h-4 w-4 items-center justify-center rounded-sm opacity-0 transition-opacity hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            closeFile(file.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {openFiles.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={closeAllFiles}
                    className="h-7 px-2 text-xs"
                  >
                    Close All
                  </Button>
                )}
              </div>
            </Tabs>
          </div>

          {/* Main editor + preview area */}
          <div
            ref={containerRef}
            className="flex flex-1 min-h-0 w-full overflow-hidden bg-[#05070b]"
          >
            {/* Editor */}
            <div
              className="h-full min-h-0 overflow-hidden"
              style={{ width: `${editorWidth}%` }}
            >
              {openFiles.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-sm text-muted-foreground">
                    No file open.
                  </div>
                </div>
              ) : (
                <PlaygroundEditor
                  activeFile={activeFile}
                  content={activeFile?.content || ""}
                  onContentChange={(value) =>
                    activeFileId && updateFileContent(activeFileId, value)
                  }
                />
              )}
            </div>

            {/* Divider */}
            <div
              onMouseDown={startDragging}
              className={`relative h-full w-px shrink-0 bg-border/70 transition-colors ${
                isPreviewVisible
                  ? "opacity-100 hover:bg-primary/60"
                  : "pointer-events-none opacity-0"
              }`}
            >
              <div className="absolute inset-y-0 -left-1.5 -right-1.5 cursor-col-resize" />
            </div>

            {/* Preview (always mounted) */}
            <div
              className={`h-full min-h-0 overflow-hidden border-l border-border/40 bg-background transition-all duration-300 ${
                isPreviewVisible
                  ? "opacity-100 translate-x-0"
                  : "pointer-events-none opacity-0 translate-x-2"
              }`}
              style={{
                width: isPreviewVisible ? `${previewWidth}%` : "0%",
              }}
            >
              <WebContainerPreview
                templateData={templateData}
                instance={instance}
                writeFileSync={writeFileSync}
                isLoading={containerLoading}
                error={containerError}
                serverUrl={serverUrl!}
                forceResetup={false}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  </TooltipProvider>
);
};

export default MainPlaygroundPage;
