CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    check_interval INTEGER NOT NULL DEFAULT 1,
    last_active_at TIMESTAMP
);

CREATE TABLE monitored_urls (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    url VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    last_status VARCHAR(20),
    last_checked_at TIMESTAMP
);

CREATE TABLE outages (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    url_id VARCHAR(36) NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    reason VARCHAR(255),

    CONSTRAINT fk_outage_url FOREIGN KEY (url_id) REFERENCES monitored_urls(id) ON DELETE CASCADE
);