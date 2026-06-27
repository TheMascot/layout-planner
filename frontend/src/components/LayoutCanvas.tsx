import { useState } from 'react';
import type { Shape, Surface } from '../types/shapes';

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

  function getMousePosition(svg: SVGSVGElement, event: React.MouseEvent) {
    const rect = svg.getBoundingClientRect();

    const scaleX = surface.width / rect.width;
    const scaleY = surface.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!draggingId) return;

    const svg = e.currentTarget;
    const mouse = getMousePosition(svg, e);

    setShapes((prev) =>
      prev.map((s) =>
        s.id === draggingId
          ? {
              ...s,
              posX: mouse.x - offset.x,
              posY: mouse.y - offset.y,
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

  return (
    <>
      <svg
        viewBox={`0 0 ${surface.width} ${surface.height}`}
        style={{
          width: surface.width * zoom,
          height: surface.height * zoom,
          border: '1px solid red',
        }}
        onMouseMove={(e) => {
          handleMouseMove(e);
        }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            onSelect(null);
          }
        }}
        onMouseLeave={() => {
          setDraggingId(null);
        }}
        onMouseUp={() => {
          setDraggingId(null);
        }}
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
            fill={shape.id === selectedId ? 'orange' : 'steelblue'}
            stroke={shape.id === selectedId ? 'blue' : 'black'}
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
      <footer></footer>
    </>
  );
}
