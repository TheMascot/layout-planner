package com.mascot.layout_planner.dto.incoming;

import com.mascot.layout_planner.domain.GeometryType;
import com.mascot.layout_planner.domain.PlacedObjectCategory;
import jakarta.validation.constraints.NotNull;

public class PlacedObjectCreateCommand {

    @NotNull
    private String name;

    @NotNull
    private PlacedObjectCategory category;

    @NotNull
    private GeometryType geometryType;

    @NotNull
    private Double positionX;

    @NotNull
    private Double positionY;

    private Integer rotation;

    private Double width;

    private Double length;

    private Double radius;

    private Double safetyDistance;

    @NotNull
    private Long surfaceId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public PlacedObjectCategory getCategory() {
        return category;
    }

    public void setCategory(PlacedObjectCategory category) {
        this.category = category;
    }

    public GeometryType getGeometryType() {
        return geometryType;
    }

    public void setGeometryType(GeometryType geometryType) {
        this.geometryType = geometryType;
    }

    public Double getPositionX() {
        return positionX;
    }

    public void setPositionX(Double positionX) {
        this.positionX = positionX;
    }

    public Double getPositionY() {
        return positionY;
    }

    public void setPositionY(Double positionY) {
        this.positionY = positionY;
    }

    public Integer getRotation() {
        return rotation;
    }

    public void setRotation(Integer rotation) {
        this.rotation = rotation;
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

    public Double getRadius() {
        return radius;
    }

    public void setRadius(Double radius) {
        this.radius = radius;
    }

    public Double getSafetyDistance() {
        return safetyDistance;
    }

    public void setSafetyDistance(Double safetyDistance) {
        this.safetyDistance = safetyDistance;
    }

    public Long getSurfaceId() {
        return surfaceId;
    }

    public void setSurfaceId(Long surfaceId) {
        this.surfaceId = surfaceId;
    }
}
