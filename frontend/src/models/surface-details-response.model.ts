import type {PlacedObjectResponseModel} from "./placed-object-response.model.ts";

export type SurfaceDetailsResponseModel = {
    id: number;
    name: string;
    width: number;
    length: number;
    placedObjects: PlacedObjectResponseModel[];
}