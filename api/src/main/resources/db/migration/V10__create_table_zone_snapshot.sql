CREATE TABLE zone_snapshot (
    zone_id TEXT PRIMARY KEY,
    payload JSONB NOT NULL,
    updated_at TIMESTAMP(6) WITH TIME ZONE NOT NULL
);