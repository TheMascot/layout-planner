import { useState } from 'react';
import LayoutCanvas from './components/LayoutCanvas';
import { surface as initialSurface, shapes as initialShapes } from './data/sampleLayout';
import TopBar from './components/TopBar';
import InfoPanel from './components/InfoPanel';

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(5);
  const [shapes, setShapes] = useState(initialShapes);
  const [camera, setCamera] = useState({ x: 0, y: 0 });

  const selectedShape = shapes.find((s) => s.id === selectedId) ?? null;

  return (
    <div style={{ height: '95vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar setZoom={setZoom} />
      {/* MAIN AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* LEFT PANEL */}
        {/* CANVAS */}
        <div style={{ flex: 1 }}>
          <LayoutCanvas
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
