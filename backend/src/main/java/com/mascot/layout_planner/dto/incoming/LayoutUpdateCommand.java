package com.mascot.layout_planner.dto.incoming;

import java.util.List;

public class LayoutUpdateCommand {

    private String name;
    private Double width;
    private Double length;
    private List<PlacedObjectUpdateCommand> placedObjects;

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

    public List<PlacedObjectUpdateCommand> getPlacedObjects() {
        return placedObjects;
    }

    public void setPlacedObjects(List<PlacedObjectUpdateCommand> placedObjects) {
        this.placedObjects = placedObjects;
    }
}



