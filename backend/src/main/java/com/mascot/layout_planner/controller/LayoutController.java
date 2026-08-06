package com.mascot.layout_planner.controller;

import com.mascot.layout_planner.dto.outgoing.PlacedObjectListItem;
import com.mascot.layout_planner.dto.outgoing.SurfaceDetails;
import com.mascot.layout_planner.dto.outgoing.SurfaceListItem;
import com.mascot.layout_planner.service.LayoutService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/layout")
public class LayoutController {

   private final LayoutService layoutService;
   private final Logger logger = LoggerFactory.getLogger(LayoutController.class);

    public LayoutController(LayoutService layoutService) {
        this.layoutService = layoutService;
    }

    @GetMapping("/surfaces/{surfaceId}/placed-objects")
    public ResponseEntity<List<PlacedObjectListItem>> getPlacedObjects(
            @PathVariable("surfaceId") Long surfaceId
    )
    {
     logger.info("*** GET REQUEST to placed objects on surface with id: {}", surfaceId);
     return new ResponseEntity<>(this.layoutService.findAllPlacedObjectBySurfaceId(surfaceId), HttpStatus.OK);
    }

    @GetMapping("/surfaces")
    public ResponseEntity<List<SurfaceListItem>> getAllSurfaces()
    {
        logger.info("*** GET REQUEST for all surfaces");
        return new ResponseEntity<>(this.layoutService.findAllSurfaces(), HttpStatus.OK);
    }

    @GetMapping("/surfaces/{surfaceId}")
    public ResponseEntity<SurfaceDetails> getSurfaceById(@PathVariable Long surfaceId)
    {
        logger.info("*** GET REQUEST for surface with id: {}", surfaceId);
        return new ResponseEntity<>(this.layoutService.findSurfaceById(surfaceId), HttpStatus.OK);
    }
}
