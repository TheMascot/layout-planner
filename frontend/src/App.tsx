import { useState } from 'react';
import { surface as initialSurface, shapes as initialShapes } from './data/sampleLayout';
import TopBar from './components/TopBar';
import InfoPanel from './components/InfoPanel';
import type { VisualSettings } from './types/visualSettings';
import type { ToolMode } from './types/tools';
import type { Shape } from './types/shapes';
import Canvas from './components/canvas_layers/Canvas';
import {useAnnotationTool} from "./hooks/useAnnotationTool.ts";
import {isShapeInsideSurface, normalizeDegree} from "./calculations/geometry.ts";

function App() {
  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(5);
  const [shapes, setShapes] = useState<Shape[]>(initialShapes);
  const [settings, setSettings] = useState<VisualSettings>({
    showGrid: true,
    gridSize: 1,
    snapToGrid: true,
  });
  const annotationTool = useAnnotationTool();

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
