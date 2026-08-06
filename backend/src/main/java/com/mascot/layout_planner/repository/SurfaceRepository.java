package com.mascot.layout_planner.repository;

import com.mascot.layout_planner.domain.Surface;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SurfaceRepository extends JpaRepository<Surface, Long> {
}
