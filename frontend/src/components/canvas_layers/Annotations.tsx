import type {LineAnnotation} from '../../types/annotations';
import type {AnnotationToolApi} from '../../types/annotationToolApi.ts';
import type {ToolMode} from '../../types/tools.ts';

interface Props {
    annotations: LineAnnotation[];
    annotationTool: AnnotationToolApi;
    activeTool: ToolMode;
}

export function Annotations({annotations, annotationTool, activeTool}: Readonly<Props>) {
    return (
        <>
            {annotations.map((annotation) => (
                <line
                    key={annotation.id}
                    data-annotation-id={annotation.id}
                    x1={annotation.start.x}
                    y1={annotation.start.y}
                    x2={annotation.end.x}
                    y2={annotation.end.y}
                    stroke={annotationTool.selectedAnnotationId === annotation.id ? 'green' : annotation.color}
                    strokeWidth={annotation.width}
                    pointerEvents="stroke"
                    style={{cursor: activeTool === 'annotate' ? 'pointer' : 'auto'}}
                />
            ))}
        </>
    );
}