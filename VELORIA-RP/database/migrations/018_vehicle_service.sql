ALTER TABLE character_vehicles ADD COLUMN IF NOT EXISTS vin VARCHAR(32) NULL;
ALTER TABLE character_vehicles ADD COLUMN IF NOT EXISTS mileage DOUBLE NOT NULL DEFAULT 0;
ALTER TABLE character_vehicles ADD COLUMN IF NOT EXISTS oil DOUBLE NOT NULL DEFAULT 100;
ALTER TABLE character_vehicles ADD COLUMN IF NOT EXISTS battery DOUBLE NOT NULL DEFAULT 100;
ALTER TABLE character_vehicles ADD COLUMN IF NOT EXISTS inspection_until DATETIME NULL;
ALTER TABLE character_vehicles ADD COLUMN IF NOT EXISTS insurance_until DATETIME NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_character_vehicles_vin ON character_vehicles(vin);

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
