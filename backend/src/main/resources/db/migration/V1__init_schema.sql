CREATE TABLE aircraft_templates
(
    id            BIGINT       NOT NULL,
    icao          VARCHAR(255) NOT NULL,
    height        DOUBLE       NULL,
    aircraft_type VARCHAR(255) NOT NULL,
    CONSTRAINT pk_aircraft_templates PRIMARY KEY (id)
);

CREATE TABLE object_templates
(
    id              BIGINT AUTO_INCREMENT NOT NULL,
    name            VARCHAR(255)          NOT NULL,
    width           DOUBLE                NOT NULL,
    length          DOUBLE                NOT NULL,
    object_category VARCHAR(255)          NOT NULL,
    geometry_type   VARCHAR(255)          NOT NULL,
    created_by      BIGINT                NULL,
    created_at      datetime(6)           NOT NULL,
    updated_at      datetime(6)           NOT NULL,
    is_deleted      BIT(1)                NOT NULL,
    CONSTRAINT pk_object_templates PRIMARY KEY (id)
);

CREATE TABLE placed_objects
(
    id                 BIGINT AUTO_INCREMENT NOT NULL,
    object_template_id BIGINT                NOT NULL,
    position_x         DOUBLE                NOT NULL,
    position_y         DOUBLE                NOT NULL,
    rotation           INT                   NULL,
    safety_distance    DOUBLE                NULL,
    surface_id         BIGINT                NOT NULL,
    CONSTRAINT pk_placed_objects PRIMARY KEY (id)
);

CREATE TABLE revchanges
(
    rev        BIGINT       NOT NULL,
    entityname VARCHAR(255) NULL
);

CREATE TABLE revinfo
(
    rev      BIGINT NOT NULL,
    revtstmp BIGINT NULL,
    CONSTRAINT pk_revinfo PRIMARY KEY (rev)
);

CREATE TABLE surfaces
(
    id         BIGINT AUTO_INCREMENT NOT NULL,
    name       VARCHAR(255)          NULL,
    width      DOUBLE                NULL,
    length     DOUBLE                NULL,
    created_at datetime(6)           NULL,
    updated_at datetime(6)           NULL,
    CONSTRAINT pk_surfaces PRIMARY KEY (id)
);

CREATE TABLE vehicle_templates
(
    id BIGINT NOT NULL,
    CONSTRAINT pk_vehicle_templates PRIMARY KEY (id)
);

CREATE TABLE zone_templates
(
    id     BIGINT NOT NULL,
    radius DOUBLE NULL,
    CONSTRAINT pk_zone_templates PRIMARY KEY (id)
);

ALTER TABLE aircraft_templates
    ADD CONSTRAINT FK_AIRCRAFT_TEMPLATES_ON_ID FOREIGN KEY (id) REFERENCES object_templates (id);

ALTER TABLE placed_objects
    ADD CONSTRAINT FK_PLACED_OBJECTS_ON_OBJECT_TEMPLATE FOREIGN KEY (object_template_id) REFERENCES object_templates (id);

ALTER TABLE placed_objects
    ADD CONSTRAINT FK_PLACED_OBJECTS_ON_SURFACE FOREIGN KEY (surface_id) REFERENCES surfaces (id);

ALTER TABLE vehicle_templates
    ADD CONSTRAINT FK_VEHICLE_TEMPLATES_ON_ID FOREIGN KEY (id) REFERENCES object_templates (id);

ALTER TABLE zone_templates
    ADD CONSTRAINT FK_ZONE_TEMPLATES_ON_ID FOREIGN KEY (id) REFERENCES object_templates (id);

ALTER TABLE revchanges
    ADD CONSTRAINT fk_revchanges_on_default_tracking_modified_entities_changelog FOREIGN KEY (rev) REFERENCES revinfo (rev);