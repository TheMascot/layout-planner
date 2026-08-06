package com.mascot.layout_planner.service;

import com.mascot.layout_planner.domain.PlacedObject;
import com.mascot.layout_planner.dto.outgoing.PlacedObjectListItem;
import com.mascot.layout_planner.repository.PlacedObjectRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LayoutService {

    PlacedObjectRepository placedObjectRepository;

    public LayoutService(PlacedObjectRepository placedObjectRepository) {
        this.placedObjectRepository = placedObjectRepository;
    }

    public List<PlacedObjectListItem> findAllPlacedObjectBySurfaceId(Long surfaceId) {
        List<PlacedObject> placedObjects = placedObjectRepository.findAllBySurface_Id(surfaceId);
        return this.mapPlacedObjectsToDto(placedObjects);
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
            dto.setSurfaceId(p.getSurface().getId());
            placedObjectListItems.add(dto);
        }
        return placedObjectListItems;
    }
}
