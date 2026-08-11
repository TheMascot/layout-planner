import {useState, useEffect} from 'react';
import {useMutation, useQuery} from '@tanstack/react-query'
import {useSearchParams} from 'react-router';
import TopBar from './components/TopBar';
import InfoPanel from './components/InfoPanel';
import type {VisualSettings} from './types/visualSettings';
import type {ToolMode} from './types/tools';
import type {Shape, Surface} from './types/shapes';
import Canvas from './components/canvas_layers/Canvas';
import {useAnnotationTool} from "./hooks/useAnnotationTool.ts";
import {isShapeInsideSurface, normalizeDegree} from "./calculations/geometry.ts";
import {fetchSurfaceDetails, updateLayout} from "./services/layout.service.ts"
import type {LayoutUpdateModel} from "./models/layout-update.model.ts";
import {surfaceDetailsMapper} from "./mappers/surface-details.mapper.ts";

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

    const updateLayoutMutation = useMutation({
        mutationFn: ({ surfaceId, layout }: { surfaceId: number; layout: LayoutUpdateModel }) =>
            updateLayout(surfaceId, layout),
        onSuccess: (saved) => {
            const mapped = surfaceDetailsMapper(saved);
            setSurface(mapped.surface);
            setShapes(mapped.shapes);
            setSelectedId(null);
        },
    });

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (!surfaceDetailsQuery.data) return;
        setSurface(surfaceDetailsQuery.data.surface);
        setShapes(surfaceDetailsQuery.data.shapes);
        setSelectedId(null);

    }, [surfaceDetailsQuery.data]);
    /* eslint-enable react-hooks/set-state-in-effect */

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

    function handleSaveAll() {
        if (!surface || surfaceId === null) return;

        const layoutDto: LayoutUpdateModel = {
            name: surface.name,
            width: surface.width,
            length: surface.length,
            placedObjects: shapes.map((s) => ({
                id: s.id, // or null/undefined for new objects
                name: s.name,
                category: s.category,
                geometryType: s.geometryType,
                positionX: s.positionX,
                positionY: s.positionY,
                rotation: s.rotation,
                width: s.width,
                length: s.length,
                radius: s.radius,
                safetyDistance: s.safetyDistance,
                surfaceId: surface.id,
            })),
        };

        updateLayoutMutation.mutate({ surfaceId: Number(surfaceId), layout: layoutDto });
    }

    return (
        <div style={{height: '95vh', display: 'flex', flexDirection: 'column'}}>
            <TopBar
                setZoom={setZoom}
                onToggleGrid={handleToggleGrid}
                onToggleSnap={handleToggleSnap}
                onChangeActiveTool={handleChangeActiveTool}
                activeTool={activeTool}
                onSaveAll={handleSaveAll}
            />

            {surfaceId === null ? (
                <div style={{padding: 32}}>No surface selected. Use Load Layout to open one.</div>
            ) : surfaceDetailsQuery.isLoading ? (
                <div>Loading surface...</div>
            ) : surfaceDetailsQuery.isError ? (
                <div>{surfaceDetailsQuery.error instanceof Error ? surfaceDetailsQuery.error.message : 'Failed to load surface'}</div>
            ) : surface === null ? (
                <div>No surface to display</div>
            ) : (
                <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                    <div style={{flex: 1}}>
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
