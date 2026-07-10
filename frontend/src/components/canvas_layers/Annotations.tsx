import type { LineAnnotation } from '../../types/annotations';

interface Props {
  annotations: LineAnnotation[];
}

export function Annotations({ annotations }: Props) {
  return (
    <>
      {annotations.map((annotation) => (
        <line
          key={annotation.id}
          x1={annotation.start.x}
          y1={annotation.start.y}
          x2={annotation.end.x}
          y2={annotation.end.y}
          stroke={annotation.color}
          strokeWidth={annotation.width}
        />
      ))}
    </>
  );
}
