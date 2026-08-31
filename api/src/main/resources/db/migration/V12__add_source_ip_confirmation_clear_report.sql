ALTER TABLE confirmation
    ADD COLUMN source_ip VARCHAR(45);

ALTER TABLE clear_report
    ADD COLUMN source_ip VARCHAR(45);
