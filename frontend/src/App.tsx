import {useState, useEffect} from 'react';
import {useQuery} from '@tanstack/react-query'
import TopBar from './components/TopBar';
import InfoPanel from './components/InfoPanel';
import type {VisualSettings} from './types/visualSettings';
import type {ToolMode} from './types/tools';
import type {Shape, Surface} from './types/shapes';
import Canvas from './components/canvas_layers/Canvas';
import {useAnnotationTool} from "./hooks/useAnnotationTool.ts";
import {isShapeInsideSurface, normalizeDegree} from "./calculations/geometry.ts";
import {fetchSurfaceDetails, fetchSurfaceList} from "./services/layout.service.ts"
import {LoadLayout} from "./components/LoadLayout.tsx";

const SURFACE_ID = 1;

function App() {
    const [activeTool, setActiveTool] = useState<ToolMode>('select');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [zoom, setZoom] = useState(5);
    const [surface, setSurface] = useState<Surface | null>(null);
    const [shapes, setShapes] = useState<Shape[]>([]);
    const annotationTool = useAnnotationTool();
    const [selectedSurfaceId, setSelectedSurfaceId] = useState<number | null>(null);
    const [showLoadLayout, setShowLoadLayout] = useState(true);
    const [settings, setSettings] = useState<VisualSettings>({
        showGrid: true,
        gridSize: 1,
        snapToGrid: true,
    });

    const surfacesQuery = useQuery({
        queryKey: ['surfaces'],
        queryFn: fetchSurfaceList,
        refetchOnWindowFocus: false,
    });

    const surfaceDetailsQuery = useQuery({
        queryKey: ['surfaceDetails', selectedSurfaceId],
        queryFn: () => fetchSurfaceDetails(selectedSurfaceId as number),
        enabled: selectedSurfaceId !== null,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (surfaceDetailsQuery.data) {
            setSurface(surfaceDetailsQuery.data.surface)
            setShapes(surfaceDetailsQuery.data.shapes);
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

    function handleLoadSurface(surfaceId: number) {
        setSelectedSurfaceId(surfaceId);
        setShowLoadLayout(false);
    }

    if (surfaceDetailsQuery.isLoading) {
        return <div>Loading shapes...</div>;
    }

    if (surfaceDetailsQuery.isError) {
        return <div>{error instanceof Error ? error.message : 'Failed to load shapes'}</div>;
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

            {showLoadLayout ? (
                surfacesQuery.isLoading ? (
                    <div>Loading surfaces...</div>
                ) : surfacesQuery.isError ? (
                    <div>{surfacesQuery.error instanceof Error ? surfacesQuery.error.message : 'Failed to load surfaces'}</div>
                ) : (
                    <LoadLayout surfaces={surfacesQuery.data ?? []} onLoadSurface={handleLoadSurface} />
                )
            ) : surfaceDetailsQuery.isLoading ? (
                <div>Loading surface...</div>
            ) : surfaceDetailsQuery.isError ? (
                <div>{surfaceDetailsQuery.error instanceof Error ? surfaceDetailsQuery.error.message : 'Failed to load surface'}</div>
            ) : surface === null ? (
                <div>No selected surface to display</div>
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
