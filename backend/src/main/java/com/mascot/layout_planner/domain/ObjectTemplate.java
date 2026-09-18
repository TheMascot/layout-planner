package com.mascot.layout_planner.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

@Entity
@Table(name="object_templates")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class ObjectTemplate {

    protected ObjectTemplate() {
    }

    protected ObjectTemplate(ObjectCategory category) {
        this.objectCategory = category;}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @NotNull
    @Column(name="name")
    private String name;

    @NotNull
    @Column(name="width")
    private Double width;

    @NotNull
    @Column(name="length")
    private Double length;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name="object_category")
    private ObjectCategory objectCategory;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name="geometry_type")
    private GeometryType geometryType;

    @Column(name="created_by")
    private Long createdBy;

    @NotNull
    @Column(name="created_at")
    private Instant createdAt;

    @NotNull
    @Column(name="updated_at")
    private Instant updatedAt;

    @NotNull
    @Column(name="is_deleted")
    private Boolean isDeleted;

    @PrePersist
    public void prePersist() {
        createdAt = Instant.now();
        updatedAt = createdAt;
        isDeleted = false;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
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

    public ObjectCategory getObjectCategory() {
        return objectCategory;
    }

    public GeometryType getGeometryType() {
        return geometryType;
    }

    protected void setGeometryType(GeometryType geometryType) {
        this.geometryType = geometryType;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Boolean getDeleted() {
        return isDeleted;
    }

    public void setDeleted(Boolean deleted) {
        isDeleted = deleted;
    }
}
