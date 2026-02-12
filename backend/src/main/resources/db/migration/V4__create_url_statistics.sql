CREATE TABLE url_statistics (
    id VARCHAR(36) PRIMARY KEY,
    url_id VARCHAR(36) NOT NULL,
    total_outages INTEGER DEFAULT 0,
    total_downtime_seconds BIGINT DEFAULT 0,
    CONSTRAINT fk_url_stats FOREIGN KEY (url_id) REFERENCES monitored_urls(id) ON DELETE CASCADE
);