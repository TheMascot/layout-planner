import {useRef, useState} from "react";
import type {LineAnnotation} from "../types/annotations.ts";
import type {Point} from "../types/shapes.ts";
import type {AnnotationToolApi} from "../types/annotationToolApi.ts";

type GestureState = 'idle' | 'pending' | 'drawing';

const DRAG_THRESHOLD_PX = 6;
const MIN_LINE_LENGTH = 0.15;

export function useAnnotationTool(): AnnotationToolApi {
    const [currentLine, setCurrentLine] = useState<LineAnnotation | null>(null);
    const [annotations, setAnnotations] = useState<LineAnnotation[]>([]);
    const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
    const gestureStateRef = useRef<GestureState>('idle');
    const pointerDownClientRef = useRef<Point | null>(null);
    const pointerDownSurfaceRef = useRef<Point | null>(null);
    const pressedAnnotationIdRef = useRef<string | null>(null);

    function resetGesture() {
        gestureStateRef.current = 'idle';
        pointerDownClientRef.current = null;
        pointerDownSurfaceRef.current = null;
        pressedAnnotationIdRef.current = null;
    }


    function handleAnnotatePointerDown(
        surfacePoint: Point,
        clientPoint: Point,
        pressedAnnotationId: string | null
    ) {
        gestureStateRef.current = 'pending';
        pointerDownClientRef.current = clientPoint;
        pointerDownSurfaceRef.current = surfacePoint;
        pressedAnnotationIdRef.current = pressedAnnotationId;

        setCurrentLine(null);
        setSelectedAnnotationId(pressedAnnotationId); // line click selects, empty click clears
    }

    function handleAnnotatePointerMove(surfacePoint: Point, clientPoint: Point) {
        const state = gestureStateRef.current;
        if (state === 'idle') return;

        const startClient = pointerDownClientRef.current;
        const startSurface = pointerDownSurfaceRef.current;
        if (!startClient || !startSurface) return;

        if (state === 'pending') {
            const dx = clientPoint.x - startClient.x;
            const dy = clientPoint.y - startClient.y;
            const movedEnough = dx * dx + dy * dy >= DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX;
            if (!movedEnough) return;

            gestureStateRef.current = 'drawing';

            if (pressedAnnotationIdRef.current) {
                setSelectedAnnotationId(null); // cancel selection when drag becomes drawing
            }

            setCurrentLine({
                id: 'preview',
                start: startSurface,
                end: surfacePoint,
                color: 'red',
                width: 0.3,
                selected: false,
            });
            return;
        }

        setCurrentLine((line) => (line ? {...line, end: surfacePoint} : line));
    }

    function handleAnnotatePointerUp() {
        const state = gestureStateRef.current;

        if (state === 'pending') {
            resetGesture();
            return;
        }

        if (state === 'drawing') {
            const lineToSave = currentLine;
            if (!lineToSave) {
                resetGesture();
                return;
            }

            const length = Math.hypot(
                lineToSave.end.x - lineToSave.start.x,
                lineToSave.end.y - lineToSave.start.y,
            );

            if (length >= MIN_LINE_LENGTH) {
                setAnnotations((prev) => [
                    ...prev,
                    {
                        ...lineToSave,
                        id: crypto.randomUUID(),
                    },
                ]);
            }

            setCurrentLine(null);
        }

        resetGesture();
    }

    function handleUndoLastAnnotation() {
        setAnnotations((prev) => {
            if (prev.length === 0) return prev;
            const removed = prev.at(-1);
            if (removed?.id === selectedAnnotationId) {
                setSelectedAnnotationId(null);
            }
            return prev.slice(0, -1);
        });
    }


    function handleClearAnnotations() {
        setAnnotations([]);
        setCurrentLine(null);
        setSelectedAnnotationId(null);
        resetGesture();
    }

    function handleSelectAnnotation(id: string) {
        setSelectedAnnotationId((prev) => (prev === id ? null : id));
    }

    function handleDeleteSelectedAnnotation() {
        if (!selectedAnnotationId) return;
        setAnnotations((prev) =>
            prev.filter((el) => el.id !== selectedAnnotationId));
        setSelectedAnnotationId(null);
    }

    return {
        handleAnnotatePointerDown,
        handleAnnotatePointerMove,
        handleAnnotatePointerUp,
        handleUndoLastAnnotation,
        handleClearAnnotations,
        selectedAnnotationId,
        handleSelectAnnotation,
        handleDeleteSelectedAnnotation,
        currentLine,
        annotations,
    }
}