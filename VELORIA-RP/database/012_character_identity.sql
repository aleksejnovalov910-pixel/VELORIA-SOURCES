-- VELORIA character identity integrity.
-- utf8mb4_unicode_ci is case-insensitive, so John_Doe/john_doe style duplicates
-- are rejected consistently by MySQL as well as by the server validation layer.

ALTER TABLE characters
  ADD UNIQUE KEY uq_character_name (first_name, last_name);
