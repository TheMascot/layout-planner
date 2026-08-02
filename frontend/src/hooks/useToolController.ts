// useToolController.ts
import { useMemo } from 'react';
import type { ToolMode } from '../types/tools';
import { getMousePosition } from '../calculations/geometry';
import type { Surface } from '../types/shapes';

type SvgEvt = React.PointerEvent<SVGSVGElement>;

interface Props {
    activeTool: ToolMode;
    surface: Surface;
    vehicleTool: {
        handlePointerMove: (e: SvgEvt) => void;
        handlePointerUp: () => void;
        handleBackgroundClick: () => void;
        setDraggingId: React.Dispatch<React.SetStateAction<string | null>>;
    };
    measureTool: {
        handleMeasureMove: (e: SvgEvt) => void;
        handleMeasureStartAndStop: (p: { x: number; y: number }) => void;
    };
    annotationTool: {
        handleAnnotateMove: (p: { x: number; y: number }) => void;
        handleAnnotateClick: (p: { x: number; y: number }) => void;
        handleSaveAnnotation: () => void;
    };
}

export function useToolController({
                                      activeTool,
                                      surface,
                                      vehicleTool,
                                      measureTool,
                                      annotationTool,
                                  }: Props) {
    const handlers = useMemo(() => {
        const table: Record<ToolMode, {
            onPointerMove?: (e: SvgEvt) => void;
            onPointerDown?: (e: SvgEvt) => void;
            onPointerUp?: (e: SvgEvt) => void;
        }> = {
            select: {
                onPointerMove: vehicleTool.handlePointerMove,
                onPointerDown: (e) => { if (e.button === 0) vehicleTool.handleBackgroundClick(); },
                onPointerUp: () => vehicleTool.handlePointerUp(),
            },
            measure: {
                onPointerMove: measureTool.handleMeasureMove,
                onPointerDown: (e) => {
                    if (e.button !== 0) return;
                    e.currentTarget.setPointerCapture(e.pointerId);
                    measureTool.handleMeasureStartAndStop(getMousePosition(e.currentTarget, e, surface));
                },
                onPointerUp: (e) => e.currentTarget.releasePointerCapture(e.pointerId),
            },
            annotate: {
                onPointerMove: (e) =>
                    annotationTool.handleAnnotateMove(getMousePosition(e.currentTarget, e, surface)),
                onPointerDown: (e) => {
                    if (e.button !== 0) return;
                    e.currentTarget.setPointerCapture(e.pointerId);
                    annotationTool.handleAnnotateClick(getMousePosition(e.currentTarget, e, surface));
                },
                onPointerUp: (e) => {
                    annotationTool.handleSaveAnnotation();
                    e.currentTarget.releasePointerCapture(e.pointerId);
                },
            },
        };

        return table[activeTool];
    }, [activeTool, surface, vehicleTool, measureTool, annotationTool]);

    return {
        ...handlers,
        onPointerLeave: () => vehicleTool.setDraggingId(null),
    };
}