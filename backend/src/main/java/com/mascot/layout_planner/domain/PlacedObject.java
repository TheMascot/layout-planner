package com.mascot.layout_planner.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "placed_objects")
public class PlacedObject {

    public PlacedObject() {
        this.rotation = 0;
    }

    public PlacedObject(
            ObjectTemplate objectTemplate,
            Surface surface,
            Double positionX,
            Double positionY
    ) {
        this.objectTemplate = objectTemplate;
        this.surface = surface;
        this.positionX = positionX;
        this.positionY = positionY;
        this.rotation = 0;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "object_template_id")
    private ObjectTemplate objectTemplate;

    @NotNull
    @Column(name="position_x")
    private Double positionX;

    @NotNull
    @Column(name="position_y")
    private Double positionY;

    private Integer rotation;

    private Double safetyDistance;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="surface_id")
    private Surface surface;

    public Long getId() {
        return id;
    }

    public ObjectTemplate getObjectTemplate() {
        return objectTemplate;
    }

    public void setObjectTemplate(ObjectTemplate objectTemplate) {
        this.objectTemplate = objectTemplate;
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
