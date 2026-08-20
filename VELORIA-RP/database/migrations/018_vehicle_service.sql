ALTER TABLE character_vehicles ADD COLUMN inspection_until DATETIME NULL;

ALTER TABLE vehicle_service_history
  CHANGE COLUMN type service_type VARCHAR(48) NOT NULL,
  ADD COLUMN character_id BIGINT UNSIGNED NULL AFTER vehicle_id,
  ADD COLUMN details_json JSON NULL AFTER cost,
  ADD INDEX idx_vehicle_service_character(character_id,created_at),
  ADD CONSTRAINT fk_vehicle_service_character FOREIGN KEY(character_id) REFERENCES characters(id) ON DELETE CASCADE;
