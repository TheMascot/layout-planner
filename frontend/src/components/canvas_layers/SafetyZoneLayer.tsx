import type { Shape } from '../../types/shapes';

interface Props {
  shapes: Shape[];
}

export default function SafetyZoneLayer({ shapes }: Props) {
  return (
    <>
      {shapes.map((shape) => (
        <rect
          x={shape.posX - shape.safetyDistance}
          y={shape.posY - shape.safetyDistance}
          rx="5"
          ry="5"
          width={shape.width + shape.safetyDistance * 2}
          height={shape.length + shape.safetyDistance * 2}
          fill="rgba(255, 0, 0, 0.174)"
          stroke="red"
          strokeWidth={0.1}
          strokeDasharray="1 0"
          pointerEvents="none"
          key={shape.id}
        />
      ))}
    </>
  );
}
