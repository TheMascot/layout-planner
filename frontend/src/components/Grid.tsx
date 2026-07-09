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
            stroke="#6b6b6b"
            strokeWidth={0.05}
            strokeDasharray="0.2 0.2"
            fill="none"
          ></path>
        </pattern>
        <pattern
          id="majorGridPattern"
          width={gridSize * 5}
          height={gridSize * 5}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${gridSize * 5} 0 L 0 0 0 ${gridSize * 5}`}
            stroke="#404040"
            strokeWidth={0.05}
            fill="none"
          />
        </pattern>
      </defs>

      <rect width={surface.width} height={surface.height} fill="url(#gridPattern)" />
      <rect width={surface.width} height={surface.height} fill="url(#majorGridPattern)" />
    </>
  );
}
