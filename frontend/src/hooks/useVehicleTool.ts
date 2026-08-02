import {useState} from "react";
import {clamp, getMousePosition, snap} from "../calculations/geometry.ts";
import type {Shape, Surface} from "../types/shapes.ts";
import type {VisualSettings} from "../types/visualSettings.ts";
import type {ToolMode} from "../types/tools.ts";

interface Props {
    surface: Surface;
    // shapes: Shape[];
    setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
    settings: VisualSettings;
    activeTool: ToolMode;
    onSelect: (id: string | null) => void;
}


export function useVehicleTool({surface, setShapes, settings, activeTool, onSelect}: Props) {
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [offset, setOffset] = useState({x: 0, y: 0});

    function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
        if (!draggingId || activeTool !== 'select') return;

        const svg = e.currentTarget;
        const mouse = getMousePosition(svg, e, surface);

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
        setDraggingId(null);
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

    return {
        draggingId,
        setDraggingId,
        offset,
        setOffset,
        handlePointerMove,
        handlePointerUp,
        handleBackgroundClick,
        handleVehiclePointerDown
    };

}