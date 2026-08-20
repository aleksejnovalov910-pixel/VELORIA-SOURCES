CREATE TABLE IF NOT EXISTS vehicle_rentals (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  character_id BIGINT UNSIGNED NOT NULL,
  model VARCHAR(64) NOT NULL,
  plate VARCHAR(16) NOT NULL,
  price BIGINT UNSIGNED NOT NULL,
  started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_vehicle_rentals_character (character_id),
  INDEX idx_rental_expiry (active, expires_at),
  CONSTRAINT fk_vehicle_rentals_character FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
