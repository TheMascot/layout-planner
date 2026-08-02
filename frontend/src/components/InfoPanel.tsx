import type {Shape} from '../types/shapes';
import type {ToolMode} from "../types/tools.ts";
import type {AnnotationToolApi} from "../types/annotationToolApi.ts";

interface Props {
    selectedShape: Shape | null;
    activeTool: ToolMode;
    annotationTool: AnnotationToolApi
}

export default function InfoPanel({selectedShape, activeTool, annotationTool}: Readonly<Props>) {

    return (

        <div
            style={{
                padding: '5px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >

            {activeTool === 'select' && (
                <div className={"infoPanel"}>
                    {selectedShape ? (
                        <div style={{display: 'flex', justifyContent: 'space-around'}}>
              <span>
                <b>Name:</b> {selectedShape ? selectedShape.name : 'None'}
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
                <b>Rotation:</b> {selectedShape.rotation ?? 0} deg
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
                <div className={"infoPanel"}>
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
                            if(!annotationTool.selectedAnnotationId) return;
                            annotationTool.handleDeleteSelectedAnnotation(annotationTool.selectedAnnotationId)
                        }}
                        disabled={annotationTool.annotations.length === 0}
                    >
                        Delete selected
                    </button>
                </p>

            )}
        </div>

    )
}
