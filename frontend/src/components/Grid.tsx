import type { Surface } from '../types/shapes';

interface GripProps {
  surface: Surface;
  gridSize: number;
}

export default function Grid({ surface, gridSize }: GripProps) {
  return (
    <>
      <defs>
        <pattern id="gridPattern" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            stroke="#000000"
            strokeWidth={0.05}
            strokeDasharray="0.2 0.2"
            fill="none"
          ></path>
        </pattern>
      </defs>

      <rect width={surface.width} height={surface.height} fill="url(#gridPattern)" />
    </>
  );
}
