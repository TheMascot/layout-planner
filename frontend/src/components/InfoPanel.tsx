import {useRef} from 'react';
import type {Shape} from '../types/shapes';
import type {ToolMode} from '../types/tools.ts';
import type {AnnotationToolApi} from '../types/annotationToolApi.ts';

interface Props {
    selectedShape: Shape | null;
    activeTool: ToolMode;
    annotationTool: AnnotationToolApi;
    onRotationChange: (id: number, rotation: number) => void;
    messages: string[];
}

export default function InfoPanel({
                                      selectedShape,
                                      activeTool,
                                      annotationTool,
                                      onRotationChange,
                                      messages
                                  }: Readonly<Props>) {
    const rotationInputRef = useRef<HTMLInputElement>(null);

    const handleRotationInputWrap= ()=>
    {
        if (rotationInputRef.current !== null) {
            if (rotationInputRef.current.value === '-1') {
                rotationInputRef.current.value = '359';
            }else if (rotationInputRef.current.value === '360') {
                rotationInputRef.current.value = '0';
            }
        }
    }

    const handleRotationInputConfirm = () => {
        if (!selectedShape || !rotationInputRef.current) return;
        const next = Number(rotationInputRef.current.value);
        if (Number.isFinite(next)) {
            onRotationChange(selectedShape.id, next);
        }
    };

    return (
        <>
            <div
                style={{
                    padding: '5px',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {activeTool === 'select' && (
                    <div className="infoPanel">
                        {selectedShape ? (
                            <div style={{display: 'flex', justifyContent: 'space-around'}}>
              <span>
                <b>Name:</b> {selectedShape.name}
              </span>
                                <span>
                <b>Type:</b> {selectedShape.geometryType}
              </span>
                                <span>
                <b>Width:</b> {selectedShape.width} m
              </span>
                                <span>
                <b>Length:</b> {selectedShape.length} m
              </span>
                                <span>
                <b>Rotation: </b>
                                <input
                                    key={`${selectedShape.id}-${Math.round(selectedShape.rotation)}`}
                                    ref={rotationInputRef}
                                    type="number"
                                    step={1}
                                    defaultValue={String(Math.round(selectedShape.rotation))}
                                    onChange={handleRotationInputWrap}
                                    onBlur={handleRotationInputConfirm}
                                    style={{width: 40, border: '1px solid #000'}}
                                />
                                deg
                            </span>
                                <span>
                <b>Safety zone:</b> {selectedShape.safetyDistance ?? 0} m
              </span>
                            </div>
                        ) : (
                            <div style={{opacity: 0.6}}>Nothing is selected</div>
                        )}
                    </div>
                )}
                {activeTool === 'measure' && (
                    <div className="infoPanel">
                        <div style={{opacity: 0.6}}>TODO IMPLEMENTING LATER</div>
                    </div>
                )}
                {activeTool === 'annotate' && (
                    <p style={{display: 'flex', justifyContent: 'space-around', margin: 0}}>
                        <button
                            type="button"
                            onClick={annotationTool.handleUndoLastAnnotation}
                            disabled={annotationTool.annotations.length === 0}
                        >
                            Undo last
                        </button>
                        <button
                            type="button"
                            onClick={annotationTool.handleClearAnnotations}
                            disabled={annotationTool.annotations.length === 0}
                        >
                            Delete all
                        </button>
                        <button
                            type="button"
                            hidden={annotationTool.selectedAnnotationId === null}
                            onClick={() => {
                                if (!annotationTool.selectedAnnotationId) return;
                                annotationTool.handleDeleteSelectedAnnotation(annotationTool.selectedAnnotationId);
                            }}
                            disabled={annotationTool.annotations.length === 0}
                        >
                            Delete selected
                        </button>
                    </p>
                )}
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
                {messages.map((message) => (
                    <div key={message}>{message}</div>
                ))}
            </div>
        </>
    );
}
