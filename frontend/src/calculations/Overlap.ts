import type { Shape } from '../types/shapes';

function isOverlapping(a: Shape, b: Shape) {
  return !(
    a.posX + a.width <= b.posX ||
    a.posX >= b.posX + b.width ||
    a.posY + a.height <= b.posY ||
    a.posY >= b.posY + b.height
  );
}
export default function checkOverlapping(
  shapes: Shape[],
  conflictIds: Set<string>,
): Set<string> | null {
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      const a = shapes[i];
      const b = shapes[j];

      if (isOverlapping(a, b)) {
        conflictIds.add(a.id);
        conflictIds.add(b.id);
      }
    }
  }
  return null;
}
