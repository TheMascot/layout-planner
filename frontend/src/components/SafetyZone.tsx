interface Props {
  x: number;
  y: number;
  width: number;
  length: number;
  distance: number;
}

export default function SafetyZone({ x, y, width, length, distance }: Props) {
  return (
    <rect
      x={x - distance}
      y={y - distance}
      rx="5"
      ry="5"
      width={width + distance * 2}
      height={length + distance * 2}
      fill="rgba(255, 0, 0, 0.174)"
      stroke="red"
      strokeDasharray="0 0.1"
      pointerEvents="none"
    />
  );
}
