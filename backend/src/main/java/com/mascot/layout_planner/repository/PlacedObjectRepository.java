package com.mascot.layout_planner.repository;

import com.mascot.layout_planner.domain.PlacedObject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlacedObjectRepository extends JpaRepository<PlacedObject, Long> {
    List<PlacedObject> findAllBySurface_Id(Long surfaceId);
}
