-- V1: Migration para criar a primeira tabela no banco de dados

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    check_interval INTEGER NOT NULL DEFAULT 1,
    last_active_at TIMESTAMP
);


CREATE TABLE monitored_url (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    url VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    last_status VARCHAR(20),
    last_checked_at TIMESTAMP
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