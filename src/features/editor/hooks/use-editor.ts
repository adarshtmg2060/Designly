import { fabric } from "fabric";
import { useCallback, useState, useMemo } from "react";
import { useAutoResize } from "@/features/editor/hooks/use-auto-resize";
import {
  BuildEditorProps,
  CIRCLE_OPTIONS,
  Editor,
  RECTANGLE_OPTIONS,
  TRIANGLE_OPTIONS,
  DIAMOND_OPTIONS,
  FILL_COLOR,
  STROKE_COLOR,
  STROKE_WIDTH,
  EditorHookProps,
  STROKE_DASH_ARRAY,
  TEXT_OPTIONS,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
} from "@/features/editor/types";
import { useCanvasEvents } from "@/features/editor/hooks/use-canvas-events";
import { createFilter, isTextType } from "@/features/editor/utils";

const buildEditor = ({
  canvas,
  fillColor,
  fontFamily,
  setFontFamily,
  setFillColor,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  selectedObjects,
  strokeDashArray,
  setStrokeDashArray,
}: BuildEditorProps): Editor => {
  const getWorkspace = () => {
    return canvas.getObjects().find((object) => object.name === "clip");
  };
  const center = (object: fabric.Object) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();
    if (!center) return;
    //@ts-ignore
    canvas._centerObject(object, center);
    // canvas.centerObject(object);
  };

  const addToCanvas = (object: fabric.Object) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };
  return {
    changeImageFilter: (value: string) => {
      const objects = canvas.getActiveObjects();
      objects.forEach((object) => {
        if (object.type === "image") {
          const imageObject = object as fabric.Image;
          const effect = createFilter(value);
          imageObject.filters = effect ? [effect] : [];
          imageObject.applyFilters();
          canvas.renderAll();
        }
      });
    },
    addImage: (value: string) => {
      fabric.Image.fromURL(
        value,
        (image) => {
          const workspace = getWorkspace();
          image.scaleToWidth(workspace?.width || 0);
          image.scaleToHeight(workspace?.height || 0);
          addToCanvas(image);
        },
        {
          crossOrigin: "anonymous",
        }
      );
    },
    delete: () => {
      canvas.getActiveObjects().forEach((object) => canvas.remove(object));
      canvas.discardActiveObject();
      canvas.renderAll();
    },
    addText: (value, options) => {
      const object = new fabric.Textbox(value, {
        ...TEXT_OPTIONS,
        fill: fillColor,
        ...options,
      });
      addToCanvas(object);
    },
    getActiveOpacity: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return 1; // default opacity
      }
      const value = selectedObject.get("opacity") ?? 1;
      return value;
    },
    changeFontSize: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // faulty Ts Libery
          object.set({ fontSize: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontSize: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return FONT_SIZE;
      }
      //@ts-ignore
      const value = selectedObject.get("fontSize") || FONT_SIZE;
      return value;
    },
    changeTextAlign: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // faulty Ts Libery
          object.set({ textAlign: value });
        }
      });
      canvas.renderAll();
    },
    getActiveTextAlign: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return "left";
      }
      //@ts-ignore
      const value = selectedObject.get("textAlign") || "left";
      return value;
    },
    changeFontUnderline: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // faulty Ts Libery
          object.set({ underline: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontUnderline: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return false;
      }
      //@ts-ignore
      const value = selectedObject.get("underline") || false;
      return value;
    },
    changeFontLinethrough: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // faulty Ts Libery
          object.set({ linethrough: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontLinethrough: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return false;
      }
      //@ts-ignore
      const value = selectedObject.get("linethrough") || false;
      return value;
    },
    changeFontStyle: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // faulty Ts Libery
          object.set({ fontStyle: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontStyle: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return "normal";
      }
      //@ts-ignore
      //faulty ts library
      const value = selectedObject.get("fontStyle") || "normal";
      return value;
    },
    changeFontWeight: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // faulty Ts Libery
          object.set({ fontWeight: value });
        }
      });
      canvas.renderAll();
    },
    changeOpacity: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        object.set({ opacity: value });
      });
      canvas.renderAll();
    },
    bringForward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringForward(object);
      });
      canvas.renderAll();
      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendBackwards(object);
      });
      canvas.renderAll();
      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    changeFontFamily: (value: string) => {
      setFontFamily(value); // Updates local state (e.g., for UI)

      // Iterate over all active objects on the canvas
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          //@ts-ignore
          // faulty ts library,fontFamily exists
          object.set({ fontFamily: value }); // Update font
        }
      });

      canvas.renderAll(); // Re-render canvas
    },

    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });
      canvas.renderAll();
    },

    changeStrokeColor: (value: string) => {
      setStrokeColor(value);
      canvas.getActiveObjects().forEach((object) => {
        //text type dont have stroke
        if (isTextType(object.type)) {
          object.set({ fill: value });
          return;
        }
        object.set({ stroke: value });
      });
      canvas.renderAll();
    },
    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
      });
      canvas.renderAll();
    },
    changeStrokeDashArray: (value: number[]) => {
      setStrokeDashArray(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeDashArray: value });
      });
      canvas.renderAll();
    },
    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 50,
        ry: 50,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },
    addInverseTriangle: () => {
      const HEIGHT = 400;
      const WIDTH = 400;

      const object = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: WIDTH, y: 0 },
          { x: WIDTH / 2, y: HEIGHT },
        ],
        {
          ...TRIANGLE_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashArray,
        }
      );
      addToCanvas(object);
    },
    addDiamond: () => {
      const HEIGHT = DIAMOND_OPTIONS.height;
      const WIDTH = DIAMOND_OPTIONS.width;

      const object = new fabric.Polygon(
        [
          { x: WIDTH / 2, y: 0 },
          { x: WIDTH, y: HEIGHT / 2 },
          { x: WIDTH / 2, y: HEIGHT },
          { x: 0, y: HEIGHT / 2 },
        ],
        {
          ...DIAMOND_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashArray,
        }
      );
      addToCanvas(object);
    },
    canvas,
    getActiveFontWeight: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return FONT_WEIGHT;
      }
      //@ts-ignore
      // faulty ts library,fontFamily exists
      const value = selectedObject.get("fontWeight") || FONT_WEIGHT;
      //currently,gradients and patterns are not supported
      return value;
    },
    getActiveFontFamily: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return fontFamily;
      }
      //@ts-ignore
      // faulty ts library,fontFamily exists
      const value = selectedObject.get("fontFamily") || fontFamily;
      //currently,gradients and patterns are not supported
      return value;
    },
    getActiveFillColor: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return fillColor;
      }
      const value = selectedObject.get("fill") || fillColor;
      //currently,gradients and patterns are not supported
      return value as string;
    },
    getActiveStrokeColor: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return strokeColor;
      }
      const value = selectedObject.get("stroke") || strokeColor;
      //currently,gradients and patterns are not supported
      return value;
    },
    getActiveStrokeWidth: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return strokeWidth;
      }
      const value = selectedObject.get("strokeWidth") || strokeWidth;
      //currently,gradients and patterns are not supported
      return value;
    },
    getActiveStrokeDashArray: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return strokeDashArray;
      }
      const value = selectedObject.get("strokeDashArray") || strokeDashArray;
      //currently,gradients and patterns are not supported
      return value;
    },

    selectedObjects,
  };
};

export const useEditor = ({ clearSelectionCallback }: EditorHookProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

  const [fontFamily, setFontFamily] = useState(FONT_FAMILY);
  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] =
    useState<number[]>(STROKE_DASH_ARRAY);

  useAutoResize({
    canvas,
    container,
  });

  useCanvasEvents({
    canvas,
    setSelectedObjects,
    clearSelectionCallback,
  });

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        canvas,
        fillColor,
        strokeColor,
        strokeWidth,
        strokeDashArray,
        fontFamily,
        setFontFamily,
        setFillColor,
        setStrokeColor,
        setStrokeWidth,
        selectedObjects,
        setStrokeDashArray,
      });
    }
    return undefined;
  }, [
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    selectedObjects,
    strokeDashArray,
    fontFamily,
    setFontFamily,
  ]);

  const init = useCallback(
    ({
      initialCanvas,
      initialContainer,
    }: {
      initialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
    }) => {
      fabric.Object.prototype.set({
        cornerColor: "#FFF",
        cornerStyle: "circle",
        borderColor: "#3b82f6",
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#3b82f6",
      });

      const initialWorkspace = new fabric.Rect({
        width: 900,
        height: 1200,
        name: "clip",
        fill: "white",
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({
          color: "rgb(0,0,0,0.8)",
          blur: 5,
        }),
      });
      initialCanvas.setWidth(initialContainer.offsetWidth);
      initialCanvas.setHeight(initialContainer.offsetHeight);

      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.clipPath = initialWorkspace;

      setCanvas(initialCanvas);
      setContainer(initialContainer);
    },
    []
  );

  return { init, editor };
};
