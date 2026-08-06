package com.mascot.layout_planner.validators;

import com.mascot.layout_planner.domain.GeometryType;
import com.mascot.layout_planner.dto.incoming.PlacedObjectCreateCommand;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Component
public class PlacedObjectValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return PlacedObjectCreateCommand.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        PlacedObjectCreateCommand command = (PlacedObjectCreateCommand) target;

        if (command.getGeometryType() == null) {
            errors.rejectValue("geometryType", "placedObject.geometryType.notGiven");
            return;
        }

        if (command.getGeometryType() == GeometryType.RECTANGLE) {
            if (command.getWidth() == null) {
                errors.rejectValue("width", "placedObject.rectangle.width.notGiven");
            }
            if (command.getLength() == null) {
                errors.rejectValue("length", "placedObject.rectangle.length.notGiven");
            }
            if (command.getRadius() != null) {
                errors.rejectValue("radius", "placedObject.rectangle.radius.mustBeNullForRectangle");
            }
        }

        if (command.getGeometryType() == GeometryType.CIRCLE) {
            if (command.getRadius() == null) {
                errors.rejectValue("radius", "placedObject.circle.radius.notGiven");
            }
            if (command.getWidth() != null) {
                errors.rejectValue("width", "placedObject.circle.width.mustBeNullForCircle");
            }
            if (command.getLength() != null) {
                errors.rejectValue("length", "placedObject.circle.length.mustBeNullForCircle");
            }
        }
    }
}
