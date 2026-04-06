import { AlertTriangle, Loader } from "lucide-react";
import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { useGetTemplates } from "@/features/templates/use-get-templates";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useState } from "react";

interface TemplateSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const TemplateSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TemplateSidebarProps) => {
  const { data, isLoading, isError } = useGetTemplates();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Safely extract templates array
  const templatesArray = Array.isArray(data) ? data : data?.data ?? [];

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const handleClick = (template: any) => {
    if (!editor) return;

    try {
      // Handle both object and string JSON
      const templateData =
        typeof template.json === "string"
          ? template.json
          : JSON.stringify(template.json || template);

      editor.loadJson(templateData);

      // Highlight the selected template
      setSelectedTemplateId(template.id);

      // Optional: close sidebar after selection
      // onChangeActiveTool("select");
    } catch (error) {
      console.error("Failed to load template:", error);
      alert("Failed to load this template. Please try another one.");
    }
  };

  return (
    <aside
      className={cn(
        "bg-white border-r w-[360px] h-screen flex flex-col",
        activeTool === "templates" ? "flex" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Templates Sidebar"
        description="Use the Existing Templates"
      />

      {isLoading && (
        <div className="flex items-center justify-center flex-1">
          <Loader
            className="text-muted-foreground animate-spin"
            width={24}
            height={24}
          />
        </div>
      )}

      {isError && (
        <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
          <AlertTriangle
            className="text-muted-foreground"
            width={24}
            height={24}
          />
          <p className="text-muted-foreground text-xs">
            Failed to fetch templates
          </p>
        </div>
      )}

      <ScrollArea className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {templatesArray.map((template) => {
              const isSelected = template.id === selectedTemplateId;
              return (
                <button
                  key={template.id}
                  className={cn(
                    "relative w-full h-[120px] flex flex-col items-center justify-end group overflow-hidden border rounded-sm transition hover:opacity-80",
                    isSelected ? "border-blue-500 ring-2 ring-blue-300" : "border-muted"
                  )}
                  onClick={() => handleClick(template)}
                >
                  <div className="absolute inset-0">
                    <Image
                      fill
                      src={template.image}
                      alt={template.name || "Template"}
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-full bg-black bg-opacity-50 text-white text-xs text-center py-1">
                    {template.name || "Template"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};