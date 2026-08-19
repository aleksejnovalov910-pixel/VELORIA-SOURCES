CREATE TABLE IF NOT EXISTS economy_transactions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  character_id BIGINT UNSIGNED NOT NULL,
  account_type ENUM('cash','bank') NOT NULL,
  amount BIGINT NOT NULL,
  balance_after BIGINT NOT NULL,
  reason VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_economy_character_created(character_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS bank_transfers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sender_character_id BIGINT UNSIGNED NOT NULL,
  receiver_character_id BIGINT UNSIGNED NOT NULL,
  amount BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_bank_sender(sender_character_id, created_at),
  INDEX idx_bank_receiver(receiver_character_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS phone_numbers (
  character_id BIGINT UNSIGNED PRIMARY KEY,
  phone_number VARCHAR(16) NOT NULL UNIQUE,
  balance BIGINT NOT NULL DEFAULT 0,
  settings_json JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS phone_contacts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_character_id BIGINT UNSIGNED NOT NULL,
  contact_character_id BIGINT UNSIGNED NULL,
  phone_number VARCHAR(16) NOT NULL,
  display_name VARCHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contacts_owner(owner_character_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS phone_messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sender_number VARCHAR(16) NOT NULL,
  receiver_number VARCHAR(16) NOT NULL,
  body VARCHAR(512) NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_messages_receiver(receiver_number, created_at),
  INDEX idx_messages_sender(sender_number, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS player_settings (
  character_id BIGINT UNSIGNED PRIMARY KEY,
  keybinds_json JSON NULL,
  gameplay_json JSON NULL,
  ui_json JSON NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
