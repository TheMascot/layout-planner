import { useState } from 'react';
import type { Point, Shape, Surface } from '../types/shapes';
import checkOverlapping from '../calculations/Overlap';
import type { VisualSettings } from '../types/settings';
import Grid from './Grid';
import SafetyZone from './SafetyZone';
import type { ToolMode } from '../types/tools';
import calculateDistance from '../calculations/CalculateDistance';

interface Props {
  surface: Surface;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  settings: VisualSettings;
  activeTool: ToolMode;
}

export default function LayoutCanvas({
  surface,
  selectedId,
  onSelect,
  zoom,
  setZoom,
  shapes,
  setShapes,
  settings,
  activeTool,
}: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [measureStart, setMeasureStart] = useState<Point | null>(null);
  const [measureEnd, setMeasureEnd] = useState<Point | null>(null);
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

  function snap(value: number, gridSize: number) {
    return Math.round(value / gridSize) * gridSize;
  }

  function handleMouseDragItem(e: React.MouseEvent<SVGSVGElement>) {
    if (!draggingId || activeTool !== 'Select') return;

    const svg = e.currentTarget;
    const mouse = getMousePosition(svg, e);

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

  function handleCanvasWheel(e: React.WheelEvent<SVGSVGElement>) {
    setZoom((z) => {
      const next = z - e.deltaY * 0.005;
      return Math.max(0.5, Math.min(5, next));
    });
  }

  function handleBackgroundClick() {
    if (activeTool === 'Select') {
      onSelect(null);
    }
  }

  function handleMouseUp() {
    setDraggingId(null);
  }

  function handleMeasureClick(point: Point) {
    if (measureStart && measureEnd) {
      setMeasureEnd(null);
      setMeasureStart(null);
      return;
    }
    if (measureStart && !measureEnd) {
      setMeasureEnd(point);
      return;
    }
    if (!measureStart && !measureEnd) {
      setMeasureStart(point);
      return;
    }
    // else {
    //   setMeasureEnd(point);
    // }
  }

  function handleMeasureMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!measureStart) return;

    const point = getMousePosition(e.currentTarget, e);

    setMeasureEnd(point);
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
            cursor: activeTool !== 'Select' ? 'crosshair' : 'auto',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
          onMouseMove={(e) => {
            if (activeTool === 'Measure') {
              handleMeasureMove(e);
              return;
            }

            if (activeTool === 'Select') {
              handleMouseDragItem(e);
            }
          }}
          onMouseDown={(e) => {
            const svg = e.currentTarget;
            const point = getMousePosition(svg, e);

            if (activeTool === 'Measure' && e.button === 0) {
              handleMeasureClick(point);
              return;
            }

            if (activeTool === 'Select' && e.button === 0) {
              handleBackgroundClick();
            }
          }}
          onMouseLeave={() => {
            setDraggingId(null);
          }}
          onMouseUp={() => handleMouseUp()}
          onWheel={(e) => {
            handleCanvasWheel(e);
          }}
        >
          {/* Grid */}
          {settings.showGrid && <Grid surface={surface} gridSize={settings.gridSize} />}
          {/* Safety Zones */}
          {shapes.map((shape) => (
            <SafetyZone
              key={`${shape.id}-safety`}
              x={shape.posX}
              y={shape.posY}
              width={shape.width}
              length={shape.length}
              distance={shape.safetyDistance}
            />
          ))}
          {/* Objects */}
          {shapes.map((shape) => (
            <rect
              key={shape.id}
              x={shape.posX}
              y={shape.posY}
              width={shape.width}
              height={shape.length}
              fill={
                shape.id === selectedId
                  ? 'orange'
                  : conflictIds.has(shape.id)
                    ? '#ff4d4d'
                    : 'steelblue'
              }
              strokeWidth={1}
              style={{ cursor: activeTool === 'Select' ? 'grab' : 'auto' }}
              onMouseDown={(e) => {
                e.stopPropagation();
                if (activeTool !== 'Select') return;
                if (e.button === 0) {
                  const svg = e.currentTarget.ownerSVGElement!;
                  const mouse = getMousePosition(svg, e);

                  onSelect(shape.id);
                  setDraggingId(shape.id);

                  setOffset({
                    x: mouse.x - shape.posX,
                    y: mouse.y - shape.posY,
                  });
                }
              }}
              onMouseUp={() => {
                setDraggingId(null);
              }}
            />
          ))}
          {/* Measuring line and text */}
          {activeTool === 'Measure' && measureStart && (
            <line
              x1={measureStart.x}
              y1={measureStart.y}
              x2={measureEnd?.x ?? measureStart.x}
              y2={measureEnd?.y ?? measureStart.y}
              stroke="red"
              strokeWidth={0.2}
              strokeDasharray="1 1"
              pointerEvents="none"
            />
          )}
          {activeTool === 'Measure' && measureStart && measureEnd && (
            <text
              x={(measureStart.x + measureEnd.x) / 2}
              y={(measureStart.y + measureEnd.y) / 2}
              fill="red"
              fontSize={6}
              pointerEvents="none"
              style={{ userSelect: 'none' }}
            >
              {calculateDistance(measureStart, measureEnd).toFixed(1)} m
            </text>
          )}
        </svg>
      </div>
      <footer></footer>
    </>
  );
}
