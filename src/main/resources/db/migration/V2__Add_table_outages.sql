-- V2: Migration adicionar a tabela que armazena as quedas dos sites

CREATE TABLE outages (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    url_id VARCHAR(36) NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    reason VARCHAR(255),
    CONSTRAINT fk_outage_url FOREIGN KEY (url_id) REFERENCES monitored_urls(id) ON DELETE CASCADE
);