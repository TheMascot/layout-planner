package com.mascot.layout_planner.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;

@Entity
@Table(name = "zone_templates")
public class ZoneTemplate extends ObjectTemplate {

public ZoneTemplate() {
    super(ObjectCategory.ZONE);
}

    @Column(name="radius")
    private Double radius;

    public Double getRadius() {
        return radius;
    }

    public void setRadius(Double radius) {
        this.radius = radius;
    }

    public void setRectangleDimensions(Double width, Double length) {
        if (width == null || length == null) {
            throw new IllegalArgumentException("Width and length are required for rectangles.");
        }
        if (width <= 0 || length <= 0) {
            throw new IllegalArgumentException("Width and length must be greater than 0.");
        }
        setWidth(width);
        setLength(length);
        setRadius(0.0);
        setGeometryType(GeometryType.RECTANGLE);
    }

    public void setCircleRadius(Double radius) {
        if (radius == null || radius <= 0) {
            throw new IllegalArgumentException("Radius must be greater than 0 for circles.");
        }
        setRadius(radius);
        setWidth(0.0);
        setLength(0.0);
        setGeometryType(GeometryType.CIRCLE);
    }

    @AssertTrue
    public boolean isValidZoneDimensions() {
        if (getGeometryType() == GeometryType.CIRCLE) {
            return radius != null && radius > 0 && getWidth() == 0.0 && getLength() == 0.0;
        }
        if (getGeometryType() == GeometryType.RECTANGLE) {
            return getWidth() != null && getLength() != null && getWidth() > 0 && getLength() > 0 && radius == 0.0;
        }
        return false;
    }
}
