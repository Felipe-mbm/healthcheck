-- V1: Migration para criar a primeira tabela no banco de dados

CREATE TABLE monitored_urls (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    url VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE client_configs (
    client_id VARCHAR(36) PRIMARY KEY,
    check_interval INTEGER NOT NULL,
    last_active_at TIMESTAMP
);

CREATE TABLE monitor_logs (
    id BIGSERIAL PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL,
    url_id BIGINT NOT NULL,
    status VARCHAR(10) NOT NULL,
    event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_log_url FOREIGN KEY (url_id) REFERENCES monitored_urls(id) ON DELETE CASCADE,
    CONSTRAINT fk_log_client FOREIGN KEY (client_id) REFERENCES client_configs(client_id) ON DELETE CASCADE
);