import type {Shape} from '../../types/shapes';
import type {ToolMode} from '../../types/tools';
import {getShapeCenter} from '../../calculations/geometry.ts';

interface Props {
    shapes: Shape[];
    conflictIds: Set<number>;
    activeTool: ToolMode;
    selectedId: number | null;
    handleVehiclePointerDown: (e: React.PointerEvent<SVGRectElement>, shape: Shape) => void;
    handleRotatePointerDown: (e: React.PointerEvent<SVGCircleElement>, shape: Shape) => void;
}

const VEHICLE_FILL_SELECTED = 'orange';
const VEHICLE_FILL_CONFLICT = '#ff4d4d';
const VEHICLE_FILL_DEFAULT = 'steelblue';
const ROTATE_HANDLE_OFFSET = -3;
const ROTATE_HANDLE_RADIUS = 1;

export function VehicleLayer({
                                 shapes,
                                 conflictIds,
                                 activeTool,
                                 selectedId,
                                 handleVehiclePointerDown,
                                 handleRotatePointerDown,
                             }: Readonly<Props>) {
    return (
        <>
            {shapes.map((shape) => {
                const {x: centerX, y: centerY} = getShapeCenter(shape);
                const isSelected = shape.id === selectedId;

                return (
                    <g key={shape.id} transform={`rotate(${shape.rotation} ${centerX} ${centerY})`}>
                        <rect
                            x={shape.positionX}
                            y={shape.positionY}
                            width={shape.width}
                            height={shape.length}
                            fill={
                                isSelected
                                    ? VEHICLE_FILL_SELECTED
                                    : conflictIds.has(shape.id)
                                        ? VEHICLE_FILL_CONFLICT
                                        : VEHICLE_FILL_DEFAULT
                            }
                            strokeWidth={1}
                            style={{cursor: activeTool === 'select' ? 'grab' : 'auto'}}
                            onPointerDown={(e) => {
                                handleVehiclePointerDown(e, shape);
                            }}
                        />

                        {isSelected && activeTool === 'select' && (
                            <>
                                <rect
                                    x={shape.positionX}
                                    y={shape.positionY}
                                    width={shape.width}
                                    height={shape.length}
                                    fill="none"
                                    stroke="#111"
                                    strokeWidth={0.25}
                                    strokeDasharray="1 0.6"
                                    pointerEvents="none"
                                />
                                <line
                                    x1={centerX}
                                    y1={shape.positionY}
                                    x2={centerX}
                                    y2={shape.positionY - ROTATE_HANDLE_OFFSET}
                                    stroke="#111"
                                    strokeWidth={0.25}
                                    pointerEvents="none"
                                />
                                <circle
                                    cx={centerX}
                                    cy={shape.positionY - ROTATE_HANDLE_OFFSET}
                                    r={ROTATE_HANDLE_RADIUS}
                                    fill="#fff"
                                    stroke="#111"
                                    strokeWidth={0.25}
                                    style={{cursor: 'alias'}}
                                    onPointerDown={(e) => handleRotatePointerDown(e, shape)}
                                />
                                <text
                                    x={centerX + 1.2}
                                    y={shape.positionY - ROTATE_HANDLE_OFFSET - 0.2}
                                    fontSize={1.4}
                                    fill="#111"
                                    pointerEvents="none"
                                >
                                    {Math.round(shape.rotation)}°
                                </text>
                            </>
                        )}
                    </g>
                )
            })}
        </>
    )
}