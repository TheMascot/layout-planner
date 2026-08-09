import {useMemo} from 'react';
import type {ToolMode} from '../types/tools';
import {getMousePosition} from '../calculations/geometry';
import type {Surface} from '../types/shapes';

type SvgEvt = React.PointerEvent<SVGSVGElement>;

interface Props {
    activeTool: ToolMode;
    surface: Surface;
    vehicleTool: {
        handlePointerMove: (e: SvgEvt) => void;
        handlePointerUp: () => void;
        handleBackgroundClick: () => void;
        clearInteractions: () => void;
        setDraggingId: React.Dispatch<React.SetStateAction<number | null>>;
    };
    measureTool: {
        handleMeasureMove: (e: SvgEvt) => void;
        handleMeasureStartAndStop: (p: { x: number; y: number }) => void;
    };
    annotationTool: {
        handleAnnotatePointerDown: (surfacePoint: { x: number; y: number }, clientPoint: {
            x: number;
            y: number
        }, pressedAnnotationId: string | null) => void;
        handleAnnotatePointerMove: (surfacePoint: { x: number; y: number }, clientPoint: {
            x: number;
            y: number
        }) => void;
        handleAnnotatePointerUp: () => void;
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
                onPointerDown: (e) => {
                    if (e.button === 0) vehicleTool.handleBackgroundClick();
                },
                onPointerUp: () => vehicleTool.handlePointerUp(),
            },
            measure: {
                onPointerMove: measureTool.handleMeasureMove,
                onPointerDown: (e) => {
                    if (e.button !== 0) return;
                    e.currentTarget.setPointerCapture(e.pointerId);
                    measureTool.handleMeasureStartAndStop(getMousePosition(e.currentTarget, e, surface));
                },
                onPointerUp: (e) => {
                    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                        e.currentTarget.releasePointerCapture(e.pointerId);
                    }
                }
            },
            annotate: {
                onPointerMove: (e) =>
                    annotationTool.handleAnnotatePointerMove(
                        getMousePosition(e.currentTarget, e, surface),
                        {x: e.clientX, y: e.clientY},
                    ),
                onPointerDown: (e) => {
                    if (e.button !== 0) return;

                    const target = e.target;
                    const pressedAnnotationId =
                        target instanceof SVGLineElement ? target.dataset.annotationId ?? null : null;

                    e.currentTarget.setPointerCapture(e.pointerId);
                    annotationTool.handleAnnotatePointerDown(
                        getMousePosition(e.currentTarget, e, surface),
                        {x: e.clientX, y: e.clientY},
                        pressedAnnotationId,
                    );
                },
                onPointerUp: (e) => {
                    annotationTool.handleAnnotatePointerUp();
                    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                        e.currentTarget.releasePointerCapture(e.pointerId);
                    }
                },
            },
        };

        return table[activeTool];
    }, [activeTool, surface, vehicleTool, measureTool, annotationTool]);

    return {
        ...handlers,
        onPointerLeave: () => vehicleTool.clearInteractions()
    };
}