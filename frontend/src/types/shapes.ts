export interface Surface {
  name: string;
  width: number;
  height: number;
}

export interface RectangleShape {
  id: string;
  name: string;
  type: 'aircraft' | 'helicopter' | 'rectangle';

  posX: number;
  posY: number;

  width: number;
  length: number;

  rotation: number;

  safetyDistance: number;
}

export interface Point {
  x: number;
  y: number;
}

export type Shape = RectangleShape;
