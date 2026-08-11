package com.mascot.layout_planner.service;

import com.mascot.layout_planner.domain.PlacedObject;
import com.mascot.layout_planner.domain.Surface;
import com.mascot.layout_planner.dto.incoming.LayoutUpdateCommand;
import com.mascot.layout_planner.dto.incoming.PlacedObjectCreateCommand;
import com.mascot.layout_planner.dto.incoming.PlacedObjectUpdateCommand;
import com.mascot.layout_planner.dto.outgoing.PlacedObjectDetails;
import com.mascot.layout_planner.dto.outgoing.PlacedObjectListItem;
import com.mascot.layout_planner.dto.outgoing.SurfaceDetails;
import com.mascot.layout_planner.dto.outgoing.SurfaceListItem;
import com.mascot.layout_planner.repository.PlacedObjectRepository;
import com.mascot.layout_planner.repository.SurfaceRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;

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

    @Transactional
    public SurfaceDetails updateLayout(Long surfaceId, LayoutUpdateCommand command) {
        Surface surface = this.surfaceRepository.findById(surfaceId).orElseThrow(
                () -> new RuntimeException("Surface with id " + surfaceId + " not found"));

        // 1) Update surface fields
        this.mapLayoutUpdateCommandToSurfaceEntity(surface, command);

        // 2) Load current DB state for this surface
        List<PlacedObject> existingPlacedObjects = this.placedObjectRepository.findAllBySurface_Id(surfaceId);

        Map<Long, PlacedObject> existingById = new HashMap<>();
        for (PlacedObject existing : existingPlacedObjects) {
            existingById.put(existing.getId(), existing);
        }

        // null means "no objects sent" -> treat as empty snapshot
        List<PlacedObjectUpdateCommand> incomingCommands =
                command.getPlacedObjects() == null ? List.of() : command.getPlacedObjects();

        // Track incoming IDs (for duplicate check + delete detection)
        Set<Long> incomingIds = new HashSet<>();

        // 3) Create or update
        for (PlacedObjectUpdateCommand incoming : incomingCommands) {
            if (incoming.getSurfaceId() != null && !incoming.getSurfaceId().equals(surfaceId)) {
                throw new RuntimeException(
                        "Placed object surfaceId " + incoming.getSurfaceId() +
                                " does not match path surfaceId " + surfaceId);
            }

            Long placedObjectId = incoming.getId();

            if (placedObjectId == null) {
                // Create new object
                PlacedObject created = new PlacedObject();
                this.applyPlacedObjectUpdateCommandToEntity(incoming, created, surface);
                this.placedObjectRepository.save(created);
                continue;
            }

            if (!incomingIds.add(placedObjectId)) {
                throw new RuntimeException("Duplicate placed object id in request: " + placedObjectId);
            }

            PlacedObject existing = existingById.get(placedObjectId);
            if (existing == null) {
                throw new RuntimeException(
                        "Placed object with id " + placedObjectId + " not found on surface " + surfaceId);
            }

            // Update existing object in-place (no extra query)
            this.applyPlacedObjectUpdateCommandToEntity(incoming, existing, surface);
            this.placedObjectRepository.save(existing);
        }

        // 4) Delete objects that existed in DB but are not in incoming snapshot
        List<PlacedObject> toDelete = new ArrayList<>();
        for (PlacedObject existing : existingPlacedObjects) {
            if (!incomingIds.contains(existing.getId())) {
                toDelete.add(existing);
            }
        }
        if (!toDelete.isEmpty()) {
            this.placedObjectRepository.deleteAll(toDelete);
        }

        this.surfaceRepository.save(surface);
        return this.findSurfaceById(surfaceId);
    }

    private void applyPlacedObjectUpdateCommandToEntity(
            PlacedObjectUpdateCommand dto,
            PlacedObject entity,
            Surface surface) {

        entity.setName(dto.getName());
        entity.setCategory(dto.getCategory());
        entity.setGeometryType(dto.getGeometryType());
        entity.setPositionX(dto.getPositionX());
        entity.setPositionY(dto.getPositionY());
        entity.setRotation(dto.getRotation());
        entity.setWidth(dto.getWidth());
        entity.setLength(dto.getLength());
        entity.setRadius(dto.getRadius());
        entity.setSafetyDistance(dto.getSafetyDistance());
        entity.setSurface(surface);
    }

    private void mapLayoutUpdateCommandToSurfaceEntity(Surface surface, LayoutUpdateCommand command) {
        surface.setName(command.getName());
        surface.setLength(command.getLength());
        surface.setWidth(command.getWidth());
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
