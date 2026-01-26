-- V1: Migration to create the initial database tables

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    check_interval INTEGER NOT NULL DEFAULT 1,
    last_active_at TIMESTAMP
);

CREATE TABLE outages (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    url_id VARCHAR(36) NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    reason VARCHAR(255),
    CONSTRAINT fk_outage_url FOREIGN KEY (url_id) REFERENCES monitored_urls(id) ON DELETE CASCADE
);

CREATE TABLE monitor_log (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(36) NOT NULL,
    url_id BIGINT NOT NULL,
    status VARCHAR(10) NOT NULL,
    event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_log_url FOREIGN KEY (url_id) REFERENCES monitored_url(id) ON DELETE CASCADE,
    CONSTRAINT fk_log_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);