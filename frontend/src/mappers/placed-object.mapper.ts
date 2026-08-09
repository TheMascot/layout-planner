import type {Shape} from "../types/shapes.ts";
import type {PlacedObjectResponseModel} from '../models/placed-object-response.model.ts'


export function mapPlacedObjectToShape(item: PlacedObjectResponseModel): Shape {
    if (item.geometryType !== 'RECTANGLE' || item.width == null || item.length == null) {
        throw new Error(`Placed object ${item.id} is not a rectangle, but the canvas only supports rectangles now.`);
    }
    return {
        id: item.id,
        name: item.name,
        geometryType: item.geometryType,
        category: item.category,
        posX: item.positionX,
        posY: item.positionY,
        width: item.width,
        length: item.length,
        rotation: item.rotation ?? 0,
        radius: item.radius ?? 0,
        safetyDistance: item.safetyDistance ?? 0,
    };
}