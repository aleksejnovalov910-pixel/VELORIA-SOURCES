ALTER TABLE character_vehicles ADD COLUMN vin VARCHAR(32) NULL;
ALTER TABLE character_vehicles ADD COLUMN mileage DOUBLE NOT NULL DEFAULT 0;
ALTER TABLE character_vehicles ADD COLUMN oil DOUBLE NOT NULL DEFAULT 100;
ALTER TABLE character_vehicles ADD COLUMN battery DOUBLE NOT NULL DEFAULT 100;
ALTER TABLE character_vehicles ADD COLUMN inspection_until DATETIME NULL;
ALTER TABLE character_vehicles ADD COLUMN insurance_until DATETIME NULL;
ALTER TABLE character_vehicles ADD UNIQUE KEY uq_character_vehicles_vin (vin);

CREATE TABLE IF NOT EXISTS vehicle_service_history(
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  vehicle_id BIGINT UNSIGNED NOT NULL,
  character_id BIGINT UNSIGNED NOT NULL,
  service_type VARCHAR(32) NOT NULL,
  cost BIGINT NOT NULL DEFAULT 0,
  details_json JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id),
  INDEX idx_vehicle_service_vehicle(vehicle_id,created_at),
  INDEX idx_vehicle_service_character(character_id,created_at),
  CONSTRAINT fk_vehicle_service_vehicle FOREIGN KEY(vehicle_id) REFERENCES character_vehicles(id) ON DELETE CASCADE,
  CONSTRAINT fk_vehicle_service_character FOREIGN KEY(character_id) REFERENCES characters(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
