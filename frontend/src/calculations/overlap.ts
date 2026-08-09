import type { Point, Shape } from '../types/shapes';
import { getRotatedRectCorners } from './geometry';

function dot(a: Point, b: Point) {
  return a.x * b.x + a.y * b.y;
}

function subtract(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y };
}

function normalize(v: Point): Point {
  const length = Math.hypot(v.x, v.y);
  if (length === 0) return { x: 0, y: 0 };
  return { x: v.x / length, y: v.y / length };
}

function getAxes(corners: Point[]): Point[] {
  const axes: Point[] = [];

  for (let i = 0; i < corners.length; i++) {
    const p1 = corners[i];
    const p2 = corners[(i + 1) % corners.length];
    const edge = subtract(p2, p1);

    // Perpendicular vector to edge
    const normal = normalize({ x: -edge.y, y: edge.x });
    axes.push(normal);
  }

  return axes;
}

function project(corners: Point[], axis: Point): { min: number; max: number } {
  let min = dot(corners[0], axis);
  let max = min;

  for (let i = 1; i < corners.length; i++) {
    const value = dot(corners[i], axis);
    if (value < min) min = value;
    if (value > max) max = value;
  }

  return { min, max };
}

function overlapsOnAxis(aCorners: Point[], bCorners: Point[], axis: Point): boolean {
  const a = project(aCorners, axis);
  const b = project(bCorners, axis);

  // No overlap if one projection is completely before the other
  return !(a.max <= b.min || b.max <= a.min);
}

function isOverlapping(a: Shape, b: Shape): boolean {
  const aCorners = getRotatedRectCorners(a);
  const bCorners = getRotatedRectCorners(b);

  // SAT: test all normals from both polygons
  const axes = [...getAxes(aCorners), ...getAxes(bCorners)];

  for (const axis of axes) {
    if (!overlapsOnAxis(aCorners, bCorners, axis)) {
      return false; // Found separating axis
    }
  }

  return true; // No separating axis => overlap
}

export default function checkOverlapping(shapes: Shape[]): Set<number> {
  const overlapping = new Set<number>();

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