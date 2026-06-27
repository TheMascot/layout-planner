import { useState } from 'react';
import type { Shape, Surface } from '../types/shapes';
import checkOverlapping from '../calculations/Overlap';

interface Props {
  surface: Surface;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
}

export default function LayoutCanvas({
  surface,
  selectedId,
  onSelect,
  zoom,
  setZoom,
  shapes,
  setShapes,
}: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const conflictIds = new Set<string>();

  function getMousePosition(svg: SVGSVGElement, event: React.MouseEvent) {
    const rect = svg.getBoundingClientRect();

    const scaleX = surface.width / rect.width;
    const scaleY = surface.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }

  function handleMouseDragItem(e: React.MouseEvent<SVGSVGElement>) {
    if (!draggingId) return;

    const svg = e.currentTarget;
    const mouse = getMousePosition(svg, e);

    setShapes((prev) =>
      prev.map((s) =>
        s.id === draggingId
          ? {
              ...s,
              posX: clamp(mouse.x - offset.x, 0, surface.width - s.width),
              posY: clamp(mouse.y - offset.y, 0, surface.height - s.height),
            }
          : s,
      ),
    );
  }

  function handleCanvasWheel(e: React.WheelEvent<SVGSVGElement>) {
    e.preventDefault();
    setZoom((z) => {
      const next = z - e.deltaY * 0.005;
      return Math.max(0.5, Math.min(5, next));
    });
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onSelect(null);
    }
  }

  function handleMouseUp() {
    setDraggingId(null);
  }

  checkOverlapping(shapes, conflictIds);

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          border: '1px solid black',
        }}
      >
        <svg
          viewBox={`0 0 ${surface.width} ${surface.height}`}
          style={{
            width: surface.width * zoom,
            height: surface.height * zoom,
            border: '1px solid red',
          }}
          onMouseMove={(e) => {
            handleMouseDragItem(e);
          }}
          onMouseDown={(e) => {
            handleMouseDown(e);
          }}
          onMouseLeave={() => {
            setDraggingId(null);
          }}
          onMouseUp={() => handleMouseUp()}
          onWheel={(e) => {
            handleCanvasWheel(e);
          }}
        >
          {shapes.map((shape) => (
            <rect
              key={shape.id}
              x={shape.posX}
              y={shape.posY}
              width={shape.width}
              height={shape.height}
              fill={
                shape.id === selectedId
                  ? 'orange'
                  : conflictIds.has(shape.id)
                    ? '#ff4d4d'
                    : 'steelblue'
              }
              stroke={
                shape.id === selectedId ? 'blue' : conflictIds.has(shape.id) ? 'darkred' : 'black'
              }
              strokeWidth={1}
              style={{ cursor: 'grab', boxSizing: 'border-box' }}
              onMouseDown={(e) => {
                e.stopPropagation();

                const svg = e.currentTarget.ownerSVGElement!;
                const mouse = getMousePosition(svg, e);

                onSelect(shape.id);
                setDraggingId(shape.id);

                setOffset({
                  x: mouse.x - shape.posX,
                  y: mouse.y - shape.posY,
                });
              }}
              onMouseUp={() => {
                setDraggingId(null);
              }}
            />
          ))}
        </svg>
      </div>
      <footer></footer>
    </>
  );
}
