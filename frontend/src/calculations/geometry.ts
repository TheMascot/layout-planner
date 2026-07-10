import type { Surface } from '../types/shapes';

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
