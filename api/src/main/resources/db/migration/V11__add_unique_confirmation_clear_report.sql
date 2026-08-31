ALTER TABLE confirmation
    ADD CONSTRAINT uq_confirmation_alert_username UNIQUE (alert_id, username);

ALTER TABLE clear_report
    ADD CONSTRAINT uq_clear_report_alert_username UNIQUE (alert_id, username);
