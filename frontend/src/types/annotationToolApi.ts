import type {LineAnnotation} from "./annotations.ts";
import type {Point} from "./shapes.ts";

export interface AnnotationToolApi {
    currentLine: LineAnnotation | null;
    annotations: LineAnnotation[];

    handleAnnotatePointerDown: (
        surfacePoint: Point,
        clientPoint: Point,
        pressedAnnotationId: string | null
    ) => void;
    handleAnnotatePointerMove: (surfacePoint: Point, clientPoint: Point) => void;
    handleAnnotatePointerUp: () => void;

    handleUndoLastAnnotation: () => void;
    handleClearAnnotations: () => void;
    handleDeleteSelectedAnnotation: (id: string) => void;

    selectedAnnotationId: string | null;
    handleSelectAnnotation: (id: string) => void;

}