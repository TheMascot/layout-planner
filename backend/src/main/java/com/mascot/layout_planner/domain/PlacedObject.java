package com.mascot.layout_planner.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "placed_objects")
public class PlacedObject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    private PlacedObjectCategory category;

    @NotNull
    @Enumerated(EnumType.STRING)
    private GeometryType geometryType;

    @NotNull
    @Column(name="position_x")
    private Double positionX;

    @NotNull
    @Column(name="position_y")
    private Double positionY;

    private Integer rotation;

    private Double width;

    private Double length;

    private Double radius;

    private Double safetyDistance;

    @NotNull
    @ManyToOne()
    @JoinColumn(name="surface_id")
    private Surface surface;

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

    public Surface getSurface() {
        return surface;
    }

    public void setSurface(Surface surface) {
        this.surface = surface;
    }
}
