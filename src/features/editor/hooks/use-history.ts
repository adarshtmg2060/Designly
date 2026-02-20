import { useCallback, useRef, useState } from "react";
import { fabric } from "fabric";
import { JSON_KEYS } from "@/features/editor/types";

interface UseHistoryProps {
  canvas: fabric.Canvas | null;
  saveCallback?: (values: {
    json: string;
    height: number;
    width: number;
  }) => void;
}

export const useHistory = ({ canvas, saveCallback }: UseHistoryProps) => {
  const [historyIndex, setHistoryIndex] = useState(0);
  const canvasHistory = useRef<string[]>([]);
  const skipSave = useRef(false);

  // Undo/Redo availability
  const canUndo = useCallback(() => historyIndex > 0, [historyIndex]);
  const canRedo = useCallback(
    () => historyIndex < canvasHistory.current.length - 1,
    [historyIndex],
  );

  // Save current canvas state
  const save = useCallback(
    (skip = false) => {
      if (!canvas) return;

      const currentState = canvas.toJSON(JSON_KEYS);
      const json = JSON.stringify(currentState);

      if (!skip && !skipSave.current) {
        canvasHistory.current.push(json);
        setHistoryIndex(canvasHistory.current.length - 1);
      }

      // Find workspace after objects are guaranteed to exist
      const workspace = canvas.getObjects().find((obj) => obj.name === "clip");
      const height = workspace?.height || 0;
      const width = workspace?.width || 0;

      saveCallback?.({ json, height, width });
    },
    [canvas, saveCallback],
  );

  // Undo action
  const undo = useCallback(() => {
    if (!canUndo() || !canvas) return;

    skipSave.current = true;
    const previousIndex = historyIndex - 1;
    const previousState = JSON.parse(canvasHistory.current[previousIndex]);

    canvas.loadFromJSON(previousState, () => {
      canvas.renderAll();
      setHistoryIndex(previousIndex);
      skipSave.current = false;
    });
  }, [canvas, historyIndex, canUndo]);

  // Redo action
  const redo = useCallback(() => {
    if (!canRedo() || !canvas) return;

    skipSave.current = true;
    const nextIndex = historyIndex + 1;
    const nextState = JSON.parse(canvasHistory.current[nextIndex]);

    canvas.loadFromJSON(nextState, () => {
      canvas.renderAll();
      setHistoryIndex(nextIndex);
      skipSave.current = false;
    });
  }, [canvas, historyIndex, canRedo]);

  return { save, undo, redo, canUndo, canRedo, setHistoryIndex, canvasHistory };
};
