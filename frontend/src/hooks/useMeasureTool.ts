import {useState} from "react";
import type {MeasuringData} from "../types/measuringData.ts";
import type {Point, Surface} from "../types/shapes.ts";
import {getMousePosition} from "../calculations/geometry.ts";

export function useMeasureTool(surface: Surface) {
    const [measuringData, setMeasuringData] = useState<MeasuringData>({
        isMeasuring: false,
        isMeasurementDisplayed: false,
        measuringStart: null,
        measuringEnd: null,
    });

    function handleMeasureStartAndStop(point: Point) {
        if (measuringData.isMeasurementDisplayed) {
            setMeasuringData((data) => ({
                ...data,
                isMeasuring: false,
                measuringStart: null,
                measuringEnd: null,
                isMeasurementDisplayed: false,
            }));
            return;
        }
        if (!measuringData.isMeasuring && !measuringData.isMeasurementDisplayed) {
            setMeasuringData((data) => ({
                ...data,
                isMeasuring: true,
                measuringStart: point,
                measuringEnd: point,
                isMeasurementDisplayed: false,
            }));
        } else {
            setMeasuringData((data) => ({
                ...data,
                isMeasuring: false,
                measuringEnd: point,
                isMeasurementDisplayed: true,
            }));
        }
    }

    function handleMeasureMove(e: React.PointerEvent<SVGSVGElement>) {
        if (!measuringData.measuringStart) return;
        if (measuringData.isMeasuring) {
            const point = getMousePosition(e.currentTarget, e, surface);

            setMeasuringData((data) => ({
                ...data,
                measuringEnd: point,
            }));
        }
    }

    return {
        measuringData,
        handleMeasureStartAndStop,
        handleMeasureMove,
    }
}