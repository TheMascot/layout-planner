import {useEffect, useState} from 'react';
import type {Shape} from '../types/shapes';
import type {ToolMode} from '../types/tools.ts';
import type {AnnotationToolApi} from '../types/annotationToolApi.ts';

interface Props {
    selectedShape: Shape | null;
    activeTool: ToolMode;
    annotationTool: AnnotationToolApi;
    onRotationChange: (id: string, rotation: number) => void;
}

export default function InfoPanel({
                                      selectedShape,
                                      activeTool,
                                      annotationTool,
                                      onRotationChange,
                                  }: Readonly<Props>) {
    const [rotationInput, setRotationInput] = useState<string>('0');

    // Sync input whenever selectedShape changes
    useEffect(() => {
        if (selectedShape) {
            setRotationInput(String(Math.round(selectedShape.rotation)));
        }
    }, [selectedShape?.id, selectedShape?.rotation]);

    const handleRotationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRotationInput(e.target.value);
    };

    const handleRotationInputConfirm = () => {
        if (!selectedShape) return;
        const next = Number(rotationInput);
        if (Number.isFinite(next)) {
            onRotationChange(selectedShape.id, next);
        }
    };

    const handleRotationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleRotationInputConfirm();
        }
    };

    return (
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
                <b>Type:</b> {selectedShape.type}
              </span>
                            <span>
                <b>Width:</b> {selectedShape.width} m
              </span>
                            <span>
                <b>Length:</b> {selectedShape.length} m
              </span>
                            <span>
                <b>Rotation:</b>
                                <input
                                    type="number"
                                    step={1}
                                    value={rotationInput}
                                    onChange={handleRotationInputChange}
                                    onKeyDown={handleRotationKeyDown}
                                    onBlur={handleRotationInputConfirm}
                                    style={{width: 64}}
                                />
                                deg
                            </span>
                            <button type="button" onClick={() => onRotationChange(selectedShape.id, 0)}>
                                Reset rot
                            </button>
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
    );
}