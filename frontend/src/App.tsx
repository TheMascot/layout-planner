import {useState, useEffect} from 'react';
import {useQuery} from '@tanstack/react-query'
import { useSearchParams } from 'react-router';
import TopBar from './components/TopBar';
import InfoPanel from './components/InfoPanel';
import type {VisualSettings} from './types/visualSettings';
import type {ToolMode} from './types/tools';
import type {Shape, Surface} from './types/shapes';
import Canvas from './components/canvas_layers/Canvas';
import {useAnnotationTool} from "./hooks/useAnnotationTool.ts";
import {isShapeInsideSurface, normalizeDegree} from "./calculations/geometry.ts";
import {fetchSurfaceDetails} from "./services/layout.service.ts"

function App() {
    const [searchParams] = useSearchParams();
    const surfaceId = searchParams.get('surfaceId');
    const [activeTool, setActiveTool] = useState<ToolMode>('select');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [zoom, setZoom] = useState(5);
    const [surface, setSurface] = useState<Surface | null>(null);
    const [shapes, setShapes] = useState<Shape[]>([]);
    const annotationTool = useAnnotationTool();
    const [settings, setSettings] = useState<VisualSettings>({
        showGrid: true,
        gridSize: 1,
        snapToGrid: true,
    });

    const surfaceDetailsQuery = useQuery({
        queryKey: ['surfaceDetails', surfaceId],
        queryFn: () => fetchSurfaceDetails(Number(surfaceId)),
        enabled: surfaceId !== null,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (surfaceDetailsQuery.data) {
            setSurface(surfaceDetailsQuery.data.surface);
            setShapes(surfaceDetailsQuery.data.shapes);
            setSelectedId(null);
        }
    }, [surfaceDetailsQuery.data]);

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

    function handleUpdateShapeRotation(id: number, rotation: number) {
        const normalized = normalizeDegree(rotation);

        setShapes((prev) =>
            prev.map((s) => {
                if (s.id !== id) return s;

                const candidate = {...s, rotation: normalized};

                if (surface !== null) {
                    if (!isShapeInsideSurface(candidate, surface)) {
                        return s; // reject invalid manual angle
                    }
                }
                return candidate;
            }),
        );
    }

    return (
        <div style={{ height: '95vh', display: 'flex', flexDirection: 'column' }}>
            <TopBar
                setZoom={setZoom}
                onToggleGrid={handleToggleGrid}
                onToggleSnap={handleToggleSnap}
                onChangeActiveTool={handleChangeActiveTool}
                activeTool={activeTool}
            />

            {surfaceId === null ? (
                <div style={{ padding: 32 }}>No surface selected. Use Load Layout to open one.</div>
            ) : surfaceDetailsQuery.isLoading ? (
                <div>Loading surface...</div>
            ) : surfaceDetailsQuery.isError ? (
                <div>{surfaceDetailsQuery.error instanceof Error ? surfaceDetailsQuery.error.message : 'Failed to load surface'}</div>
            ) : surface === null ? (
                <div>No surface to display</div>
            ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1 }}>
                        <Canvas
                            settings={settings}
                            surface={surface}
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
                    <InfoPanel
                        selectedShape={selectedShape}
                        activeTool={activeTool}
                        annotationTool={annotationTool}
                        onRotationChange={handleUpdateShapeRotation}
                    />
                </div>
            )}
        </div>
    );
}

export default App;
