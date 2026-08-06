export interface Surface {
  name: string;
  width: number;
  length: number;
}

export interface RectangleShape {
  id: string;
  name: string;

  category: 'AIRCRAFT' | 'VEHICLE' | 'EQUIPMENT';
  geometryType: 'RECTANGLE' | 'CIRCLE';

  posX: number;
  posY: number;

  width: number;
  length: number;

  rotation: number;
  radius: number;

  safetyDistance: number;
}

export interface Point {
  x: number;
  y: number;
}

export type Shape = RectangleShape;
