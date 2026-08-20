CREATE TABLE IF NOT EXISTS family_invites (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  family_id BIGINT UNSIGNED NOT NULL,
  inviter_character_id BIGINT UNSIGNED NOT NULL,
  target_character_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_family_invite_target (target_character_id),
  INDEX idx_family_invites_expiry (expires_at),
  CONSTRAINT fk_family_invites_family FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  CONSTRAINT fk_family_invites_inviter FOREIGN KEY (inviter_character_id) REFERENCES characters(id) ON DELETE CASCADE,
  CONSTRAINT fk_family_invites_target FOREIGN KEY (target_character_id) REFERENCES characters(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
