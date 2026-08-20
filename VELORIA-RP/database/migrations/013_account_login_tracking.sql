SET @has_last_login := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'accounts'
    AND COLUMN_NAME = 'last_login_at'
);

SET @sql := IF(
  @has_last_login = 0,
  'ALTER TABLE accounts ADD COLUMN last_login_at DATETIME NULL AFTER created_at',
  'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
