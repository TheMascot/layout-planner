import { useState } from 'react';
import LayoutCanvas from './components/LayoutCanvas';
import { surface as initialSurface, shapes as initialShapes } from './data/sampleLayout';
import TopBar from './components/TopBar';
import InfoPanel from './components/InfoPanel';
import type { VisualSettings } from './types/settings';

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(5);
  const [shapes, setShapes] = useState(initialShapes);
  const [settings, setSettings] = useState<VisualSettings>({
    showGrid: true,
    gridSize: 1,
    snapToGrid: true,
  });

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

  return (
    <div style={{ height: '95vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar setZoom={setZoom} onToggleGrid={handleToggleGrid} onToggleSnap={handleToggleSnap} />
      {/* MAIN AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* CANVAS */}
        <div style={{ flex: 1 }}>
          <LayoutCanvas
            settings={settings}
            surface={initialSurface}
            shapes={shapes}
            setShapes={setShapes}
            selectedId={selectedId}
            onSelect={setSelectedId}
            setZoom={setZoom}
            zoom={zoom}
          />
        </div>
        <InfoPanel selectedShape={selectedShape} />
      </div>
    </div>
  );
}
export default App;
