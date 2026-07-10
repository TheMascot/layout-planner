import type { Point } from './shapes';

export interface LineAnnotation {
  id: string;

  start: Point;
  end: Point;

  color: string;
  width: number;

  selected: boolean;
}
