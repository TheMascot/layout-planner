package com.mascot.layout_planner.dto.incoming;

import com.mascot.layout_planner.dto.outgoing.PlacedObjectListItem;

import java.util.List;

public class SurfaceUpdateCommand {

    private Long id;
    private String name;
    private Double width;
    private Double length;
    private List<PlacedObjectListItem> placedObjects;

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
}



