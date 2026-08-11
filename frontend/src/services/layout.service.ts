import type {Shape, Surface} from "../types/shapes.ts";
import {mapPlacedObjectToShape} from '../mappers/placed-object.mapper.ts'
import type {PlacedObjectResponseModel} from '../models/placed-object-response.model.ts'
import {surfaceDetailsMapper} from "../mappers/surface-details.mapper.ts";
import type {SurfaceDetailsResponseModel} from "../models/surface-details-response.model.ts";
import type { SurfaceListItemModel } from '../models/surface-list-item.model.ts';
import type {LayoutUpdateModel} from "../models/layout-update.model.ts";

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1/layout';

export async function fetchShapes(surfaceId: number): Promise<Shape[]> {
    const response = await fetch(`${API_URL}/surfaces/${surfaceId}/placed-objects`);

    if (!response.ok) {
        throw new Error('Failed to load placed objects');
    }

    const data: PlacedObjectResponseModel[] = await response.json();
    return data.map(mapPlacedObjectToShape);
}

export async function fetchSurfaceDetails(surfaceId: number) : Promise<{surface: Surface, shapes: Shape[]}> {
    const response = await fetch(`${API_URL}/surfaces/${surfaceId}`);

    if (!response.ok) {
        throw new Error('Failed to load surface');
    }
    const data: SurfaceDetailsResponseModel = await response.json();
    return surfaceDetailsMapper(data);
}


export async function fetchSurfaceList(): Promise<SurfaceListItemModel[]> {
    const response = await fetch(`${API_URL}/surfaces`);
    if (!response.ok) throw new Error('Failed to load surfaces');
    return response.json();
}

export async function updateLayout(surfaceId: number ,layout: LayoutUpdateModel): Promise<SurfaceDetailsResponseModel>{
    const response = await fetch(`${API_URL}/surfaces/${surfaceId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(layout)
    });
    if (!response.ok) throw new Error('Failed to load and update surface by id ' + surfaceId);
    return response.json();
}