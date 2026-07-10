import { useState } from 'react';
import type { Point, Shape, Surface } from '../../types/shapes';
import checkOverlapping from '../../calculations/Overlap';
import type { VisualSettings } from '../../types/visualSettings';
import Grid from '../Grid';
import type { ToolMode } from '../../types/tools';
import type { LineAnnotation } from '../../types/annotations';
import type { MeasuringData } from '../../types/measuringData';
import { clamp, getMousePosition, snap } from '../../calculations/geometry';
import { VehicleLayer } from './VehicleLayer';
import { AnnotationLine } from './AnnotationLine';
import { Annotations } from './Annotations';
import { MeasuringLine } from './MeasuringLine';
import SafetyZoneLayer from './SafetyZoneLayer';

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
  annotations: LineAnnotation[];
  setAnnotations: React.Dispatch<React.SetStateAction<LineAnnotation[]>>;
}

export default function Canvas({
  surface,
  selectedId,
  onSelect,
  zoom,
  setZoom,
  shapes,
  setShapes,
  settings,
  activeTool,
  annotations,
  setAnnotations,
}: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [currentLine, setCurrentLine] = useState<LineAnnotation | null>(null);
  const [measuringData, setMeasuringData] = useState<MeasuringData>({
    isMeasuring: false,
    isMeasurementDisplayed: false,
    measuringStart: null,
    measuringEnd: null,
  });
  const conflictIds = new Set<string>();

  function handleMouseDragItem(e: React.PointerEvent<SVGSVGElement>) {
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

  function handleCanvasWheel(e: React.WheelEvent<SVGSVGElement>) {
    setZoom((z) => {
      const next = z - e.deltaY * 0.005;
      return Math.max(0.5, Math.min(10, next));
    });
  }

  function handleBackgroundClick() {
    if (activeTool === 'select') {
      onSelect(null);
    }
  }

  function handleMouseUp() {
    setDraggingId(null);
  }

  function handleMeasureStartAndStop(point: Point) {
    if (measuringData.isMeasurementDisplayed) {
      setMeasuringData((data) => ({
        ...data,
        isMeasuring: false,
        measuringStart: null,
        measuringEnd: null,
        isMeasurementDisplayed: false,
      }));
      return;
    }
    if (!measuringData.isMeasuring && !measuringData.isMeasurementDisplayed) {
      setMeasuringData((data) => ({
        ...data,
        isMeasuring: true,
        measuringStart: point,
        measuringEnd: point,
        isMeasurementDisplayed: false,
      }));
    } else {
      setMeasuringData((data) => ({
        ...data,
        isMeasuring: false,
        measuringEnd: point,
        isMeasurementDisplayed: true,
      }));
    }
  }

  function handleMeasureMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!measuringData.measuringStart) return;
    if (measuringData.isMeasuring) {
      const point = getMousePosition(e.currentTarget, e, surface);

      setMeasuringData((data) => ({
        ...data,
        measuringEnd: point,
      }));
    }
  }

  function handleAnnotateClick(point: Point) {
    setCurrentLine({
      id: 'preview',
      start: point,
      end: point,
      color: 'red',
      width: 0.3,
      selected: true,
    });
  }

  function handleAnnotateMove(point: Point) {
    setCurrentLine((line) => {
      if (!line) return null;

      return {
        ...line,
        end: point,
      };
    });
  }

  function handleSaveAnnotation() {
    if (!currentLine) return;
    setAnnotations((prev) => [
      ...prev,
      {
        ...currentLine!,
        id: crypto.randomUUID(),
      },
    ]);

    setCurrentLine(null);
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
            cursor: activeTool !== 'select' ? 'crosshair' : 'auto',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
          onPointerMove={(e) => {
            if (activeTool === 'measure') {
              handleMeasureMove(e);
              return;
            }
            if (activeTool === 'select') {
              handleMouseDragItem(e);
              return;
            }
            if (activeTool === 'annotate') {
              const point = getMousePosition(e.currentTarget, e, surface);
              handleAnnotateMove(point);
              return;
            }
          }}
          onPointerDown={(e) => {
            const point = getMousePosition(e.currentTarget, e, surface);

            if (activeTool === 'measure' && e.button === 0) {
              e.currentTarget.setPointerCapture(e.pointerId);
              handleMeasureStartAndStop(point);
              return;
            }

            if (activeTool === 'select' && e.button === 0) {
              handleBackgroundClick();
            }
            if (activeTool === 'annotate' && e.button === 0) {
              e.currentTarget.setPointerCapture(e.pointerId);
              handleAnnotateClick(point);
            }
          }}
          onPointerLeave={() => {
            setDraggingId(null);
          }}
          onPointerUp={(e) => {
            if (activeTool === 'measure') {
              e.currentTarget.releasePointerCapture(e.pointerId);
            }
            if (activeTool === 'select') {
              handleMouseUp();
            }
            if (activeTool === 'annotate') {
              handleSaveAnnotation();
              e.currentTarget.releasePointerCapture(e.pointerId);
            }
          }}
          onWheel={(e) => {
            handleCanvasWheel(e);
          }}
        >
          {/* Grid */}
          {settings.showGrid && <Grid surface={surface} gridSize={settings.gridSize} />}
          {/* Current line */}
          {currentLine?.start && <AnnotationLine currentLine={currentLine} />}
          {/* Stored annotations*/}
          <Annotations annotations={annotations} />
          {/* Safety Zones */}
          <SafetyZoneLayer shapes={shapes} />
          {/* Vehicles */}
          <VehicleLayer
            shapes={shapes}
            surface={surface}
            conflictIds={conflictIds}
            activeTool={activeTool}
            selectedId={selectedId}
            onSelect={onSelect}
            setDraggingId={setDraggingId}
            setOffset={setOffset}
          />

          {/* Measuring line and text */}
          {activeTool === 'measure' && <MeasuringLine measuringData={measuringData} />}
        </svg>
      </div>
      <footer></footer>
    </>
  );
}
