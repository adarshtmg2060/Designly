import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRemoveBackground } from "@/features/ai/api/use-bgremove-image";

import { AlertTriangle, Loader } from "lucide-react";
import Image from "next/image";

interface RemoveBgSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const RemoveBgSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: RemoveBgSidebarProps) => {
  const mutation = useRemoveBackground();

  const selectedObject = editor?.selectedObjects[0];

  const imageSrc = selectedObject?._originalElement?.currentSrc;

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onClick = () => {
    if (!imageSrc || !editor || !selectedObject) return;

    mutation.mutate(imageSrc, {
      onSuccess: (imgUrl) => {
        // Add new background-removed image
        editor.addImage(imgUrl);
      },
      onError: (err) => {
        console.error("Failed to remove background:", err);
      },
    });
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "remove-bg" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Background remove"
        description="Remove background from image using AI"
      />
      {!imageSrc && (
        <div className="flex flex-col gap-y-4 items-center justify-center felx-1">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-xs">
            Feature not avaiable for this object
          </p>
        </div>
      )}
      {imageSrc && (
        <ScrollArea>
          <div className="p-4 space-y-4">
            <div
              className={cn(
                "relative aspect-square rounded-md overflow-hidden transition bg-muted",
                mutation.isPending && "opacity-50"
              )}
            >
              <Image src={imageSrc} fill alt="Image" className="object-cover" />
            </div>
            <Button
              onClick={onClick}
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader className="mr-2 size-4 animate-spin" />
                  Removing background...
                </>
              ) : (
                "Remove background"
              )}
            </Button>
          </div>
        </ScrollArea>
      )}
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
