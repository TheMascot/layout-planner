import type { Shape } from '../types/shapes';

function isOverlapping(a: Shape, b: Shape) {
  return !(
    a.posX + a.width <= b.posX ||
    a.posX >= b.posX + b.width ||
    a.posY + a.length <= b.posY ||
    a.posY >= b.posY + b.length
  );
}
export default function checkOverlapping(
  shapes: Shape[]
): Set<string> {
  let overlapping: Set<string> = new Set();
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      const a = shapes[i];
      const b = shapes[j];

      if (isOverlapping(a, b)) {
        overlapping.add(a.id);
        overlapping.add(b.id);
      }
    }
  }
  return overlapping;
}
