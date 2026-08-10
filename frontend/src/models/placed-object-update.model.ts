export type PlacedObjectUpdateModel = {
    id: number;
    name: string;
    category: 'AIRCRAFT' | 'VEHICLE' | 'EQUIPMENT';
    geometryType: 'RECTANGLE' | 'CIRCLE';
    positionX: number;
    positionY: number;
    rotation: number | null;
    width: number | null;
    length: number | null;
    radius: number | null;
    safetyDistance: number | null;
    surfaceId: number;
};
