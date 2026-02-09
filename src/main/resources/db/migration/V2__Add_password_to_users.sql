-- 1. Garante que a coluna password exista (seguindo o padrão da V1)
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- 2. Atualiza ou insere o admin com os nomes de colunas CORRETOS da V1
INSERT INTO users (id, email, password, role, check_interval)
VALUES (
           '7da2266a-eb49-4ae6-aa33-05529db2e99b',
           'admin@system.com',
           '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.zUbZb8a', -- Hash de '123456'
           'ADMIN',
           60
       )
    ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;