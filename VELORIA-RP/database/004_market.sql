CREATE TABLE IF NOT EXISTS market_purchases (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  listing_id BIGINT UNSIGNED NOT NULL,
  buyer_character_id BIGINT UNSIGNED NOT NULL,
  seller_character_id BIGINT UNSIGNED NOT NULL,
  price BIGINT NOT NULL,
  payload_json JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_market_purchase_buyer(buyer_character_id, created_at),
  INDEX idx_market_purchase_seller(seller_character_id, created_at),
  INDEX idx_market_purchase_listing(listing_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
