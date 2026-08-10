import type {Shape} from '../../types/shapes';
import {getShapeCenter} from "../../calculations/geometry.ts";

interface Props {
    shapes: Shape[];
}

const SAFETY_FILL = 'rgba(255, 0, 0, 0.174)';
const SAFETY_STROKE = 'red';
const SAFETY_STROKE_WIDTH = 0.1;
const SAFETY_DASH = '1 0';
const SAFETY_RADIUS = 5;

export default function SafetyZoneLayer({shapes}: Readonly<Props>) {

    return (
        <>
            {shapes.map((shape) => {

                const {x: centerX, y: centerY} = getShapeCenter(shape);

                return (

                    <g key={shape.id} transform={`rotate(${shape.rotation} ${centerX} ${centerY})`}>
                        <rect
                            x={shape.positionX - shape.safetyDistance}
                            y={shape.positionY - shape.safetyDistance}
                            rx={SAFETY_RADIUS}
                            ry={SAFETY_RADIUS}
                            width={shape.width + shape.safetyDistance * 2}
                            height={shape.length + shape.safetyDistance * 2}
                            fill={SAFETY_FILL}
                            stroke={SAFETY_STROKE}
                            strokeWidth={SAFETY_STROKE_WIDTH}
                            strokeDasharray={SAFETY_DASH}
                            pointerEvents="none"
                        />
                    </g>
                )
            })}
        </>
    );
}
