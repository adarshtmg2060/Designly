"use client";
 
import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { AlertTriangle } from "lucide-react";

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

 
  const selectedObject = editor?.selectedObjects[0];

  const imageSrc = selectedObject?._originalElement?.currentSrc;

  const onClose = () => {
    onChangeActiveTool("select");
  };

  // ✅ CANVAS-BASED BACKGROUND REMOVAL (replaces API)
  const onClick = () => {
    if (!imageSrc || !editor || !selectedObject) return;
    

    const img = new Image();

    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = img.width;
      const height = img.height;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      const getIndex = (x: number, y: number) => (y * width + x) * 4;

      // ✅ Sample background points
      const samplePoints = [
        [0, 0],
        [width - 1, 0],
        [0, height - 1],
        [width - 1, height - 1],
        [Math.floor(width / 2), 0],
        [Math.floor(width / 2), height - 1],
      ];

      let br = 0, bg = 0, bb = 0;

      samplePoints.forEach(([x, y]) => {
        const i = getIndex(x, y);
        br += data[i];
        bg += data[i + 1];
        bb += data[i + 2];
      });

      br /= samplePoints.length;
      bg /= samplePoints.length;
      bb /= samplePoints.length;

      const colorDist = (i: number) => {
        const dr = data[i] - br;
        const dg = data[i + 1] - bg;
        const db = data[i + 2] - bb;
        return Math.sqrt(dr * dr + dg * dg + db * db);
      };

      const threshold = 60;
      const softZone = 30;

      const alphaMap = new Float32Array(width * height);

      for (let i = 0; i < width * height; i++) {
        const d = colorDist(i * 4);

        if (d < threshold) {
          alphaMap[i] = 0;
        } else if (d < threshold + softZone) {
          const t = (d - threshold) / softZone;
          alphaMap[i] = t * t;
        } else {
          alphaMap[i] = 1;
        }
      }

      // ✅ feather smoothing
      const feather = 2;
      const smoothed = new Float32Array(alphaMap);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let sum = 0;
          let count = 0;

          for (let dy = -feather; dy <= feather; dy++) {
            for (let dx = -feather; dx <= feather; dx++) {
              const nx = x + dx;
              const ny = y + dy;

              if (nx >= 0 && ny >= 0 && nx < width && ny < height) {
                sum += alphaMap[ny * width + nx];
                count++;
              }
            }
          }

          smoothed[y * width + x] = sum / count;
        }
      }

      // ✅ apply alpha
      for (let i = 0; i < width * height; i++) {
        data[i * 4 + 3] = Math.round(smoothed[i] * 255);
      }

      ctx.putImageData(imageData, 0, 0);

   
      const resultUrl = canvas.toDataURL("image/png");


      editor.delete?.();
      editor.addImage(resultUrl);
    };

    img.onerror = (err) => {
      console.error("Failed to load image", err);
    };
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
                "relative aspect-square rounded-md overflow-hidden transition bg-muted"
              )}
            >
              <img src={imageSrc} alt="Image" className="object-cover" />
            </div>

            <Button onClick={onClick} className="w-full">
              Remove background
            </Button>
          </div>
        </ScrollArea>
      )}

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};  