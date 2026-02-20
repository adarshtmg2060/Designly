import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { JSON_KEYS } from "@/features/editor/types";

interface UseLoadStateProps {
  autoZoom: () => void;
  canvas: fabric.Canvas | null;
  initialState: React.MutableRefObject<string | undefined>;
  canvasHistory: React.MutableRefObject<string[]>;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const useLoadState = ({
  canvas,
  autoZoom,
  initialState,
  canvasHistory,
  setHistoryIndex,
}: UseLoadStateProps) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && initialState?.current && canvas) {
      const data = JSON.parse(initialState.current);

      // Load canvas JSON
      canvas.loadFromJSON(data, () => {
        canvas.renderAll();

        // Make sure workspace exists
        const workspace = canvas
          .getObjects()
          .find((obj) => obj.name === "clip");
        if (!workspace) {
          console.warn("Workspace object ('clip') not found on canvas!");
        }

        // Save initial state in history
        const currentState = JSON.stringify(canvas.toJSON(JSON_KEYS));
        canvasHistory.current = [currentState];
        setHistoryIndex(0);

        // Auto zoom after canvas is fully loaded
        requestAnimationFrame(autoZoom);
      });

      initialized.current = true;
    }
  }, [canvas, autoZoom, initialState, canvasHistory, setHistoryIndex]);
};
