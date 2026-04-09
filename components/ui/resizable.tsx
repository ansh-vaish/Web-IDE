"use client";

import * as React from "react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "@/lib/utils";

const ResizablePanelGroup = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.Group>,
  React.ComponentProps<typeof ResizablePrimitive.Group>
>(({ className, ...props }, ref) => {
  return (
    <ResizablePrimitive.Group
      ref={ref}
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
});
ResizablePanelGroup.displayName = "ResizablePanelGroup";

const ResizablePanel = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.Panel>,
  React.ComponentProps<typeof ResizablePrimitive.Panel>
>(({ ...props }, ref) => {
  return (
    <ResizablePrimitive.Panel
      ref={ref}
      data-slot="resizable-panel"
      {...props}
    />
  );
});
ResizablePanel.displayName = "ResizablePanel";

const ResizableHandle = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.Separator>,
  React.ComponentProps<typeof ResizablePrimitive.Separator> & {
    withHandle?: boolean;
  }
>(({ withHandle, className, ...props }, ref) => {
  return (
    <ResizablePrimitive.Separator
      ref={ref}
      data-slot="resizable-handle"
      className={cn(
        "relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border" />
      )}
    </ResizablePrimitive.Separator>
  );
});
ResizableHandle.displayName = "ResizableHandle";

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
