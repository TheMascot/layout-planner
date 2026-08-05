import {useState} from "react";
import {
    clamp,
    getAngleFromCenter,
    getMousePosition,
    getShapeCenter, isShapeInsideSurface,
    normalizeDegree,
    snap
} from "../calculations/geometry.ts";
import type {Shape, Surface} from "../types/shapes.ts";
import type {VisualSettings} from "../types/visualSettings.ts";
import type {ToolMode} from "../types/tools.ts";

interface Props {
    surface: Surface;
    setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
    settings: VisualSettings;
    activeTool: ToolMode;
    onSelect: (id: string | null) => void;
}


export function useVehicleTool({surface, setShapes, settings, activeTool, onSelect}: Props) {
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [offset, setOffset] = useState({x: 0, y: 0});
    const [rotatingId, setRotatingId] = useState<string | null>(null);
    const [rotationOffset, setRotationOffset] = useState(0);

    function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
        if (activeTool !== 'select') return;

        const svg = e.currentTarget;
        const mouse = getMousePosition(svg, e, surface);

        if (rotatingId) {
            setShapes((prev) =>
                prev.map((s) => {
                    if (s.id !== rotatingId) return s;
                    const center = getShapeCenter(s);
                    const pointerAngle = getAngleFromCenter(center, mouse);
                    const nextRotation = normalizeDegree(pointerAngle + rotationOffset);

                    const candidate = { ...s, rotation: nextRotation };
                    if (!isShapeInsideSurface(candidate, surface)) {
                        return s; // keep last valid rotation
                    }

                    return candidate;
                }),
            );
            return;
        }

        if (!draggingId) return;

        setShapes((prev) =>
            prev.map((s) => {
                if (s.id !== draggingId) return s;

                let newX = mouse.x - offset.x;
                let newY = mouse.y - offset.y;

                if (settings.snapToGrid) {
                    newX = snap(newX, settings.gridSize);
                    newY = snap(newY, settings.gridSize);
                }

                return {
                    ...s,
                    posX: clamp(newX, 0, surface.width - s.width),
                    posY: clamp(newY, 0, surface.height - s.length),
                };
            }),
        );
    }

    function handlePointerUp() {
        clearInteractions();
    }

    function handleBackgroundClick() {
            onSelect(null);
    }

    function handleVehiclePointerDown(e: React.PointerEvent<SVGRectElement>, shape: Shape) {
        e.stopPropagation();
        if (activeTool !== 'select') return;
        if (e.button === 0) {
            const svg = e.currentTarget.ownerSVGElement!;
            const mouse = getMousePosition(svg, e, surface);

            onSelect(shape.id);
            setDraggingId(shape.id);

            setOffset({
                x: mouse.x - shape.posX,
                y: mouse.y - shape.posY,
            });
        }
    }

    function handleRotatePointerDown(e: React.PointerEvent<SVGCircleElement>, shape: Shape) {
        e.stopPropagation();
        if (activeTool !== 'select' || e.button !== 0) return;

        const svg = e.currentTarget.ownerSVGElement;
        if (!svg) return;

        const mouse = getMousePosition(svg, e, surface);
        const center = getShapeCenter(shape);
        const pointerAngle = getAngleFromCenter(center, mouse);

        onSelect(shape.id);
        setDraggingId(null);
        setRotatingId(shape.id);
        setRotationOffset(shape.rotation - pointerAngle);
    }

    function clearInteractions() {
        setDraggingId(null);
        setRotatingId(null);
    }

    return {
        draggingId,
        rotatingId,
        setDraggingId,
        offset,
        setOffset,
        handlePointerMove,
        handlePointerUp,
        clearInteractions,
        handleBackgroundClick,
        handleVehiclePointerDown,
        handleRotatePointerDown,
    };

}