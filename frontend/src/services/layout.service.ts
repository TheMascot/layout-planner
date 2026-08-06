import type {Shape} from "../types/shapes.ts";
import {mapPlacedObjectToShape} from '../mappers/placed-object.mapper.ts'
import type {PlacedObjectResponseModel} from '../models/placed-object-response.model.ts'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1/layout';

export async function fetchShapes(surfaceId: number): Promise<Shape[]> {
    const response = await fetch(`${API_URL}/surfaces/${surfaceId}/placed-objects`);

    if (!response.ok) {
        throw new Error('Failed to load placed objects');
    }

    const data: PlacedObjectResponseModel[] = await response.json();
    return data.map(mapPlacedObjectToShape);
}