import type {Shape} from '../../types/shapes';
import type {ToolMode} from '../../types/tools';

interface Props {
    shapes: Shape[];
    conflictIds: Set<string>;
    activeTool: ToolMode;
    selectedId: string | null;
    setDraggingId: React.Dispatch<React.SetStateAction<string | null>>;
    handleVehiclePointerDown: (e: React.PointerEvent<SVGRectElement>, shape: Shape) => void;
}

export function VehicleLayer({
                                 shapes,
                                 conflictIds,
                                 activeTool,
                                 selectedId,
                                 setDraggingId,
                                 handleVehiclePointerDown
                             }: Readonly<Props>) {

    return (
        <>
            {shapes.map((shape) => (
                <rect
                    key={shape.id}
                    x={shape.posX}
                    y={shape.posY}
                    width={shape.width}
                    height={shape.length}
                    fill={
                        shape.id === selectedId ? 'orange' : conflictIds.has(shape.id) ? '#ff4d4d' : 'steelblue'
                    }
                    strokeWidth={1}
                    style={{cursor: activeTool === 'select' ? 'grab' : 'auto'}}
                    onPointerDown={(e) => {
                        handleVehiclePointerDown(e, shape);
                    }}
                    onPointerUp={() => {
                        setDraggingId(null);
                    }}
                />
            ))}
        </>
    );
}
