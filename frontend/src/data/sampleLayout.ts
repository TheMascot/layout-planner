import type { Surface, Shape } from '../types/shapes';

export const surface: Surface = {
  name: 'Kilo apron',
  width: 300,
  height: 60,
};

export const shapes: Shape[] = [
  {
    id: '1',
    name: 'Grippen',
    type: 'rectangle',
    posX: 0,
    posY: 0,
    width: 8.4,
    length: 14.1,
    rotation: 0,
    safetyDistance: 5,
  },
  {
    id: '2',
    name: 'C-17',
    type: 'aircraft',
    posX: 175,
    posY: 5,
    width: 51.75,
    length: 53,
    rotation: 0,
    safetyDistance: 5,
  },
  {
    id: '3',
    name: 'C-172',
    type: 'aircraft',
    posX: 100,
    posY: 20,
    width: 15,
    length: 12,
    rotation: 0,
    safetyDistance: 5,
  },
];
