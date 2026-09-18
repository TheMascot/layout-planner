package com.mascot.layout_planner.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "aircraft_templates")
public class AircraftTemplate extends ObjectTemplate {

    public AircraftTemplate() {
        super(ObjectCategory.AIRCRAFT);
        setGeometryType(GeometryType.RECTANGLE);
    }

    @NotNull
    @Column(name="icao")
    private String icao;

    @Column(name="height")
    private Double height;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name="aircraft_type")
    private AircraftType aircraftType;

    public String getIcao() {
        return icao;
    }

    public void setIcao(String icao) {
        this.icao = icao;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public AircraftType getAircraftType() {
        return aircraftType;
    }

    public void setAircraftType(AircraftType aircraftType) {
        this.aircraftType = aircraftType;
    }
}
