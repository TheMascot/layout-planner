import { getMousePosition } from '../../calculations/geometry';
import type { Shape, Surface } from '../../types/shapes';
import type { ToolMode } from '../../types/tools';

interface Props {
  shapes: Shape[];
  surface: Surface;
  conflictIds: Set<string>;
  activeTool: ToolMode;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  setDraggingId: React.Dispatch<React.SetStateAction<string | null>>;
  setOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

export function VehicleLayer({
  shapes,
  surface,
  conflictIds,
  activeTool,
  selectedId,
  onSelect,
  setDraggingId,
  setOffset,
}: Props) {
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
          style={{ cursor: activeTool === 'select' ? 'grab' : 'auto' }}
          onPointerDown={(e) => {
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
          }}
          onPointerUp={() => {
            setDraggingId(null);
          }}
        />
      ))}
    </>
  );
}
