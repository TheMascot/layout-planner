import type { LineAnnotation } from '../../types/annotations';

interface AnnotationLineProps {
  currentLine: LineAnnotation;
}

export function AnnotationLine({ currentLine }: AnnotationLineProps) {
  return (
    <line
      x1={currentLine.start.x}
      y1={currentLine.start.y}
      x2={currentLine.end.x}
      y2={currentLine.end.y}
      stroke={currentLine.color}
      strokeWidth={currentLine.width}
    />
  );
}
