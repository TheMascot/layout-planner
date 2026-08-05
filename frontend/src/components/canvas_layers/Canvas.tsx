import {useMemo} from 'react';
import type {Shape, Surface} from '../../types/shapes';
import checkOverlapping from '../../calculations/Overlap';
import type {VisualSettings} from '../../types/visualSettings';
import Grid from '../Grid';
import type {ToolMode} from '../../types/tools';
import {VehicleLayer} from './VehicleLayer';
import {AnnotationLine} from './AnnotationLine';
import {Annotations} from './Annotations';
import {MeasuringLine} from './MeasuringLine';
import SafetyZoneLayer from './SafetyZoneLayer';
import {useVehicleTool} from "../../hooks/useVehicleTool.ts";
import {useMeasureTool} from "../../hooks/useMeasureTool.ts";
import {useToolController} from "../../hooks/useToolController.ts";
import type {AnnotationToolApi} from "../../types/annotationToolApi.ts";

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
    annotationTool: AnnotationToolApi;
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
                                   annotationTool
                               }: Readonly<Props>) {
    const vehicleTool = useVehicleTool({surface, setShapes, settings, activeTool, onSelect});
    const measureTool = useMeasureTool(surface);

    const pointerHandlers = useToolController({
        activeTool,
        surface,
        vehicleTool,
        measureTool,
        annotationTool,
    });
    let conflictIds: Set<string>;

    function handleCanvasWheel(e: React.WheelEvent<SVGSVGElement>) {
        setZoom((z) => {
            const next = z - e.deltaY * 0.005;
            return Math.max(0.5, Math.min(10, next));
        });
    }

    conflictIds = useMemo(() => checkOverlapping(shapes), [shapes]);

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
                    onPointerMove={pointerHandlers.onPointerMove}
                    onPointerDown={pointerHandlers.onPointerDown}
                    onPointerLeave={pointerHandlers.onPointerLeave}
                    onPointerUp={pointerHandlers.onPointerUp}
                    onWheel={(e) => {
                        handleCanvasWheel(e);
                    }}
                >
                    {/* Grid */}
                    {settings.showGrid && <Grid surface={surface} gridSize={settings.gridSize}/>}
                    {/* Current line */}
                    {annotationTool.currentLine?.start && <AnnotationLine currentLine={annotationTool.currentLine}/>}
                    {/* Stored annotations*/}
                    <Annotations
                        annotations={annotationTool.annotations}
                        annotationTool={annotationTool}
                        activeTool={activeTool}
                    />
                    {/* Safety Zones */}
                    <SafetyZoneLayer shapes={shapes}/>
                    {/* Vehicles */}
                    <VehicleLayer
                        shapes={shapes}
                        conflictIds={conflictIds}
                        activeTool={activeTool}
                        selectedId={selectedId}
                        handleRotatePointerDown={vehicleTool.handleRotatePointerDown}
                        handleVehiclePointerDown={vehicleTool.handleVehiclePointerDown}
                    />

                    {/* Measuring line and text */}
                    {activeTool === 'measure' && <MeasuringLine measuringData={measureTool.measuringData}/>}
                </svg>
            </div>
            <footer></footer>
        </>
    );
}
