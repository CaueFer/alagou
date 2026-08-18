ALTER TABLE usuario
    ALTER COLUMN google_id DROP NOT NULL;

ALTER TABLE usuario
    ADD COLUMN password_hash VARCHAR(255);
