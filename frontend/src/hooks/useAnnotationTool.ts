import {useState} from "react";
import type {LineAnnotation} from "../types/annotations.ts";
import type {Point} from "../types/shapes.ts";

interface Props {
setAnnotations: React.Dispatch<React.SetStateAction<LineAnnotation[]>>;
}



export function useAnnotationTool({setAnnotations}:Props) {
    const [currentLine, setCurrentLine] = useState<LineAnnotation | null>(null);

    function handleAnnotateClick(point: Point) {
        setCurrentLine({
            id: 'preview',
            start: point,
            end: point,
            color: 'red',
            width: 0.3,
            selected: true,
        });
    }

    function handleAnnotateMove(point: Point) {
        setCurrentLine((line) => {
            if (!line) return null;

            return {
                ...line,
                end: point,
            };
        });
    }

    function handleSaveAnnotation() {
        if (!currentLine) return;
        setAnnotations((prev) => [
            ...prev,
            {
                ...currentLine!,
                id: crypto.randomUUID(),
            },
        ]);

        setCurrentLine(null);
    }

    return {
        handleAnnotateClick,
        handleSaveAnnotation,
        handleAnnotateMove,
        currentLine
    }

}