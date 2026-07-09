import type { Point } from '../types/shapes';

export default function calculateDistance(a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;

  return Math.sqrt(dx * dx + dy * dy);
}
