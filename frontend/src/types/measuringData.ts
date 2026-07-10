import type { Point } from './shapes';

export interface MeasuringData {
  isMeasuring: boolean;
  isMeasurementDisplayed: boolean;
  measuringStart: Point | null;
  measuringEnd: Point | null;
}
