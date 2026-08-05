import type {Point, Shape, Surface} from '../types/shapes';

export function getMousePosition(svg: SVGSVGElement, event: React.PointerEvent, surface: Surface) {
  const rect = svg.getBoundingClientRect();

  const scaleX = surface.width / rect.width;
  const scaleY = surface.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function snap(value: number, gridSize: number) {
  return Math.round(value / gridSize) * gridSize;
}

export function normalizeDegree(value: number) {
  return ((Math.round(value) % 360) + 360) % 360;
}

export function getShapeCenter(shape: Shape): Point {
  return {
    x: shape.posX + shape.width / 2,
    y: shape.posY + shape.length / 2,
  };
}

export function getAngleFromCenter(center: Point, point: Point) {
  return (Math.atan2(point.y - center.y, point.x - center.x) * 180) / Math.PI;
}

function rotatePoint(point: Point, center: Point, angleDeg: number): Point {
  const angleRad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  const dx = point.x - center.x;
  const dy = point.y - center.y;

  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  };
}

export function getRotatedRectCorners(shape: Shape): Point[] {
  const center = getShapeCenter(shape);

  const corners: Point[] = [
    { x: shape.posX, y: shape.posY },
    { x: shape.posX + shape.width, y: shape.posY },
    { x: shape.posX + shape.width, y: shape.posY + shape.length },
    { x: shape.posX, y: shape.posY + shape.length },
  ];

  return corners.map((corner) => rotatePoint(corner, center, shape.rotation));
}