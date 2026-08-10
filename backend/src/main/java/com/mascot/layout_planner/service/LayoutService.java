package com.mascot.layout_planner.service;

import com.mascot.layout_planner.domain.PlacedObject;
import com.mascot.layout_planner.domain.Surface;
import com.mascot.layout_planner.dto.incoming.SurfaceUpdateCommand;
import com.mascot.layout_planner.dto.outgoing.PlacedObjectListItem;
import com.mascot.layout_planner.dto.outgoing.SurfaceDetails;
import com.mascot.layout_planner.dto.outgoing.SurfaceListItem;
import com.mascot.layout_planner.repository.PlacedObjectRepository;
import com.mascot.layout_planner.repository.SurfaceRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LayoutService {

    private final PlacedObjectRepository placedObjectRepository;
    private final SurfaceRepository surfaceRepository;

    public LayoutService(PlacedObjectRepository placedObjectRepository, SurfaceRepository surfaceRepository) {
        this.placedObjectRepository = placedObjectRepository;
        this.surfaceRepository = surfaceRepository;
    }

    public List<PlacedObjectListItem> findAllPlacedObjectBySurfaceId(Long surfaceId) {
        List<PlacedObject> placedObjects = placedObjectRepository.findAllBySurface_Id(surfaceId);
        return this.mapPlacedObjectsToDto(placedObjects);
    }

    public List<SurfaceListItem> findAllSurfaces() {
        List<Surface> surfaces = this.surfaceRepository.findAll();
        return this.mapSurfacesToDto(surfaces);
    }

    public SurfaceDetails findSurfaceById(Long surfaceId) {
        Surface surface = this.surfaceRepository.findById(surfaceId).orElseThrow(
                () -> new RuntimeException("Surface with id " + surfaceId + " not found"));

        List<PlacedObject> placedObjects = placedObjectRepository.findAllBySurface_Id(surfaceId);
        List<PlacedObjectListItem> placedObjectListItems = this.mapPlacedObjectsToDto(placedObjects);

        return this.mapSurfaceToDto(surface, placedObjectListItems);

    }

    public void updateLayout(SurfaceUpdateCommand command) {

    }

    private SurfaceDetails mapSurfaceToDto(Surface surface, List<PlacedObjectListItem> placedObjectListItems) {
        SurfaceDetails surfaceDetails = new SurfaceDetails();
        surfaceDetails.setId(surface.getId());
        surfaceDetails.setName(surface.getName());
        surfaceDetails.setLength(surface.getLength());
        surfaceDetails.setWidth(surface.getWidth());
        surfaceDetails.setPlacedObjects(placedObjectListItems);
        surfaceDetails.setCreatedAt(surface.getCreatedAt());
        surfaceDetails.setUpdatedAt(surface.getUpdatedAt());
        return surfaceDetails;
    }

    private List<SurfaceListItem> mapSurfacesToDto(List<Surface> surfaces) {
        List<SurfaceListItem> listSurfaces = new ArrayList<>();
        for (Surface s : surfaces) {
            SurfaceListItem dto = new SurfaceListItem();
            dto.setId(s.getId());
            dto.setName(s.getName());
            dto.setLength(s.getLength());
            dto.setWidth(s.getWidth());
            dto.setCreatedAt(s.getCreatedAt());
            dto.setUpdatedAt(s.getUpdatedAt());
            listSurfaces.add(dto);
        }
        return listSurfaces;
    }

    private List<PlacedObjectListItem> mapPlacedObjectsToDto(List<PlacedObject> placedObjects) {
        List<PlacedObjectListItem> placedObjectListItems = new ArrayList<>();
        for (PlacedObject p : placedObjects) {
            PlacedObjectListItem dto = new PlacedObjectListItem();
            dto.setId(p.getId());
            dto.setName(p.getName());
            dto.setCategory(p.getCategory());
            dto.setGeometryType(p.getGeometryType());
            dto.setPositionX(p.getPositionX());
            dto.setPositionY(p.getPositionY());
            dto.setRotation(p.getRotation());
            dto.setRadius(p.getRadius());
            dto.setWidth(p.getWidth());
            dto.setLength(p.getLength());
            dto.setSafetyDistance(p.getSafetyDistance());
            if (p.getSurface() != null) {
                dto.setSurfaceId(p.getSurface().getId());
            }
            placedObjectListItems.add(dto);
        }
        return placedObjectListItems;
    }

}
