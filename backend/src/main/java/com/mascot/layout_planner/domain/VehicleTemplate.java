package com.mascot.layout_planner.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicle_templates")
public class VehicleTemplate extends ObjectTemplate {

    public VehicleTemplate() {
        super(ObjectCategory.VEHICLE);
        setGeometryType(GeometryType.RECTANGLE);
    }
}
