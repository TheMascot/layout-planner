export interface Surface {
  id: number;
  name: string;
  width: number;
  length: number;
}

export interface Shape {
  id: number;
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
