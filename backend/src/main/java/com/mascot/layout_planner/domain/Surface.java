package com.mascot.layout_planner.domain;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "surfaces")
public class Surface {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Double width;

    private Double length;

    @OneToMany(mappedBy = "surface")
    private List<PlacedObject> placedObjects;

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
}
