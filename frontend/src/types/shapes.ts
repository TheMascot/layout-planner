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
  height: number;

  rotation: number;
}

export type Shape = RectangleShape;
