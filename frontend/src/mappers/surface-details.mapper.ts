import type {SurfaceDetailsResponseModel} from "../models/surface-details-response.model.ts";
import type {Shape, Surface} from "../types/shapes.ts";
import {mapPlacedObjectToShape} from "./placed-object.mapper.ts";

export function surfaceDetailsMapper(item: SurfaceDetailsResponseModel): { surface: Surface, shapes: Shape[] } {
    return {
        surface: {
            id: item.id,
            name: item.name,
            width: item.width,
            length: item.length,
        },
        shapes: item.placedObjects.map(mapPlacedObjectToShape),
    }
}