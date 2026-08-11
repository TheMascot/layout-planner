import type {PlacedObjectUpdateModel} from "./placed-object-update.model.ts";

export type LayoutUpdateModel = {
    name: string;
    width: number;
    length: number;
    placedObjects: PlacedObjectUpdateModel[];
}