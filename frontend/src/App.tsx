import { useState, useEffect } from 'react';
import {useQuery } from '@tanstack/react-query'
import { surface as initialSurface, shapes as initialShapes } from './data/sampleLayout';
import TopBar from './components/TopBar';
import InfoPanel from './components/InfoPanel';
import type { VisualSettings } from './types/visualSettings';
import type { ToolMode } from './types/tools';
import type { Shape } from './types/shapes';
import Canvas from './components/canvas_layers/Canvas';
import {useAnnotationTool} from "./hooks/useAnnotationTool.ts";
import {isShapeInsideSurface, normalizeDegree} from "./calculations/geometry.ts";
import {fetchShapes} from "./services/layout.service.ts"

const SURFACE_ID = 1;

function App() {
  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(5);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [settings, setSettings] = useState<VisualSettings>({
    showGrid: true,
    gridSize: 1,
    snapToGrid: true,
  });
  const annotationTool = useAnnotationTool();

  const { data: queriedShapes, isLoading, isError, error } = useQuery({
    queryKey: ['placedObjects', SURFACE_ID],
    queryFn: () => fetchShapes(SURFACE_ID),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (queriedShapes) {
      setShapes(queriedShapes);
    }
  }, [queriedShapes]);

  const selectedShape = shapes.find((s) => s.id === selectedId) ?? null;

  function handleToggleGrid() {
    setSettings((currentSettings) => ({
      ...currentSettings,
      showGrid: !currentSettings.showGrid,
    }));
  }
  function handleToggleSnap() {
    setSettings((currentSettings) => ({
      ...currentSettings,
      snapToGrid: !currentSettings.snapToGrid,
    }));
  }

  function handleChangeActiveTool() {
    setActiveTool((current) => {
      if (current === 'select') {
        setSelectedId(null);
        return 'measure';
      } else if (current === 'measure') {
        return 'annotate';
      } else return 'select';
    });
  }

  function handleUpdateShapeRotation(id: string, rotation: number) {
    const normalized = normalizeDegree(rotation);

    setShapes((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;

          const candidate = { ...s, rotation: normalized };

          // use `initialSurface` from shape data
          if (!isShapeInsideSurface(candidate, initialSurface)) {
            return s; // reject invalid manual angle
          }

          return candidate;
        }),
    );
  }

  if (isLoading) {
    return <div>Loading shapes...</div>;
  }

  if (isError) {
    return <div>{error instanceof Error ? error.message : 'Failed to load shapes'}</div>;
  }

  return (
    <div style={{ height: '95vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <TopBar
        setZoom={setZoom}
        onToggleGrid={handleToggleGrid}
        onToggleSnap={handleToggleSnap}
        onChangeActiveTool={handleChangeActiveTool}
        activeTool={activeTool}
      />
      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Canvas */}
        <div style={{ flex: 1 }}>
          <Canvas
            settings={settings}
            surface={initialSurface}
            shapes={shapes}
            setShapes={setShapes}
            selectedId={selectedId}
            onSelect={setSelectedId}
            setZoom={setZoom}
            zoom={zoom}
            activeTool={activeTool}
            annotationTool={annotationTool}
          />
        </div>
        {/* Footer */}
        <InfoPanel selectedShape={selectedShape} activeTool={activeTool} annotationTool={annotationTool} onRotationChange={handleUpdateShapeRotation} />
      </div>
    </div>
  );
}
export default App;
