package com.mascot.layout_planner.dto.outgoing;

import java.time.LocalDateTime;
import java.util.List;

public class SurfaceDetails {
    private Long id;
    private String name;
    private Double width;
    private Double length;
    private List<PlacedObjectListItem> placedObjects;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getWidth() {
        return width;
    }

    public void setWidth(Double width) {
        this.width = width;
    }

    public Double getLength() {
        return length;
    }

    public void setLength(Double length) {
        this.length = length;
    }

    public List<PlacedObjectListItem> getPlacedObjects() {
        return placedObjects;
    }

    public void setPlacedObjects(List<PlacedObjectListItem> placedObjects) {
        this.placedObjects = placedObjects;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
