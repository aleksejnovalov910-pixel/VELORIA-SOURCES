ALTER TABLE accounts ADD COLUMN admin_level INT UNSIGNED NOT NULL DEFAULT 0;
ALTER TABLE accounts ADD COLUMN last_login_at DATETIME NULL;
CREATE INDEX idx_accounts_admin_level ON accounts(admin_level);
