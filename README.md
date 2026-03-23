# 🚀 HealthCheck API

[![Java](https://img.shields.io/badge/Java-21-blue?logo=java)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.4-brightgreen?logo=spring)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)](https://www.docker.com/)

---

## 📌 Visão Geral

O **HealthCheck** é uma API RESTful profissional para **monitoramento automatizado de disponibilidade de URLs**, desenvolvida em **Java 21** com **Spring Boot 3.4.1**. O sistema realiza verificações periódicas em URLs cadastradas, identifica quedas (downtime), registra incidentes de forma inteligente e mantém um histórico confiável de indisponibilidade.

O projeto foi pensado com **foco em arquitetura limpa, segurança, escalabilidade e boas práticas corporativas**, seguindo princípios **SOLID**, separação clara de responsabilidades e padrões amplamente utilizados em ambientes de produção.

> ⚠️ **Nota:** Este projeto encontra-se em desenvolvimento contínuo. As funcionalidades core já estão implementadas e possuímos um backlog transparente focado em escalabilidade, resiliência e boas práticas (detalhado na seção de Backlog Técnico).

---

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologias |
|-----------|------------|
| **Linguagem & Framework** | Java 21, Spring Boot 3.4.4 |
| **Banco de Dados** | PostgreSQL 15, Spring Data JPA, Hibernate |
| **Versionamento de DB** | Flyway |
| **Segurança** | Spring Security, Auth0 JWT, Google Auth Library (OAuth2) |
| **Comunicação HTTP** | WebClient Reativo (Spring WebFlux) |
| **Concorrência** | Virtual Threads (`Executors.newVirtualThreadPerTaskExecutor()`) |
| **Documentação** | Springdoc OpenAPI (Swagger) |

---

## 🏗️ Arquitetura do Sistema

A aplicação segue o **padrão de arquitetura em camadas**, garantindo baixo acoplamento e alta manutenibilidade:

- **Controller**: Exposição das rotas REST
- **Service**: Regras de negócio e orquestração
- **Repository**: Persistência de dados
- **Entity & DTO**: Representação do domínio e transferência de dados
- **Mapper**: Conversão entre Entidades e DTOs

### 🔐 Segurança e Autenticação

- **Spring Security** com autenticação **Stateless**
- **JWT (JSON Web Token)** utilizando **Auth0 Java-JWT**
- Integração com **Google SSO (OAuth2)**
- Assinatura com algoritmo **HMAC256**
- Tokens interceptados e validados via `SecurityFilter`

Fluxo resumido:
1. Usuário realiza login (via Google SSO).
2. Token JWT interno da aplicação é gerado.
3. Token é enviado no header `Authorization: Bearer <token>`.
4. O filtro valida e autentica a requisição.

### 🛂 Controle de Acesso (RBAC)

Controle de acesso baseado em **Roles** (`UserRole`):

| Role  | Permissões |
|------|-----------|
| **ADMIN** | Criar, listar e deletar usuários e URLs |
| **USER** | Apenas listar recursos |

As permissões são aplicadas diretamente nas rotas via Spring Security.

---

## ⏱️ Monitoramento Automatizado (Scheduler)

O coração do sistema é o **`UrlCheckScheduler`**:

- Executado automaticamente a cada **60 segundos**.
- Recupera todas as URLs cadastradas no banco.
- Executa verificações simultâneas usando **Virtual Threads**, garantindo performance sem bloqueio.

### 🌐 Lógica de Verificação
A verificação é realizada pelo **`HealthCheckService`**, utilizando **WebClient reativo**:
- **Status 2xx ou 3xx** → URL considerada **UP**
- **Qualquer outro status ou exceção** (timeout, DNS, conexão) → **DOWN**

### 🧠 Persistência Inteligente de Falhas
O sistema evita registros duplicados:
- Um registro em `outages` é criado **somente quando uma nova falha é detectada**.
- Se a URL continuar indisponível, nenhum novo registro é criado.
- Quando o site volta ao ar:
  - A falha aberta é localizada.
  - O campo `end_time` é preenchido.
  - O incidente é encerrado corretamente e as estatísticas globais de downtime são atualizadas.

---

## 🗄️ Banco de Dados e Migrações

- **PostgreSQL** como banco relacional.
- **Flyway** para versionamento e controle de schema.

### Estrutura de Tabelas
- `users`
- `monitored_urls`
- `outages`
- `url_statistics`

### Migrações
- **V1__init.sql**: Criação das tabelas e integridade referencial (`CASCADE DELETE`).
- **V2__Add_password_to_users.sql**: Adiciona coluna de senha.
- **V3__Remove_auth_and_scheduler_columns.sql**: Limpeza de colunas legadas.
- **V4__create_url_statistics.sql**: Tabela de estatísticas consolidadas de falhas.

As migrações são executadas automaticamente na inicialização da aplicação.

---

## 📁 Estrutura do Projeto

```text
src/main/java
├── config
│   ├── AppConfig
│   ├── SecurityConfig
│   └── SecurityFilter
├── controller
│   ├── AuthController
│   ├── UserController
│   └── MonitoredUrlController
├── dto
│   ├── AuthenticationDto
│   └── UserDto
├── mapper
│   ├── UserMapper
│   └── MonitoredUrlMapper
├── model
│   ├── entity
│   │   ├── User
│   │   ├── MonitoredUrl
│   │   ├── UrlStatistics
│   │   └── Outage
│   └── enums
│       └── UserRole
├── repository
│   ├── UserRepository
│   ├── MonitoredUrlRepository
│   ├── UrlStatisticsRepository
│   └── OutageRepository
├── scheduler
│   └── UrlCheckScheduler
├── service
│   ├── HealthCheckService
│   ├── TokenService
│   └── UserService
└── resources
    └── db/migration
    
# 🚀 Guia de Instalação e Execução

## 1️⃣ Clonar o Repositório

O desenvolvimento ocorre na branch `develop`:

```bash
git clone -b develop https://github.com/felipe-mbm/healthcheck.git
cd healthcheck
```

---

## 2️⃣ Subir o Banco de Dados

O projeto possui `docker-compose.yml` configurado:

```bash
docker-compose up -d postgres
```

- PostgreSQL 15 Alpine  
- Porta: 5432  
- Volume persistente: `postgres-data`

---

## 3️⃣ Configurar Variáveis de Ambiente

Antes de rodar a aplicação, configure:

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/healthcheck_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_LOCATION=classpath:db/migration
JWT_SECRET=sua-chave-secreta-jwt
ID_GOOGLE=seu-client-id-do-google.apps.googleusercontent.com
```

---

## 4️⃣ Executar a Aplicação

Com **Java 21** instalado:

```bash
./mvnw spring-boot:run
```

- Flyway aplicará as migrações automaticamente  
- API disponível em: http://localhost:8080  
- Swagger UI: http://localhost:8080/swagger-ui.html  

---

# 🧪 Guia de Testes (Postman)

## ⚠️ Criação do Primeiro Admin

A rota de criação de usuários é protegida.  
Crie o primeiro ADMIN manualmente:

```sql
INSERT INTO users (email, role)
VALUES (
  'admin@test.com',
  'ADMIN',
);
```

---

## 🔑 Autenticação

**POST** `/auth/login`

```json
{
  "email": "admin@test.com",
}
```

**Resposta:**

```json
{
  "token": "eyJhbGciOi..."
}
```

Use este token como **Bearer Token** nas próximas requisições.

---

## 👤 Gerenciamento de Usuários (ADMIN)

- `POST /users` (Criar)  
- `GET /users` (Listar)  
- `DELETE /users/{id}` (Deletar)  

---

## 🌍 Gerenciamento de URLs (ADMIN)

- `POST /urls` (Cadastrar)  
- `GET /urls` (Listar)  

```json
{
  "name": "Google",
  "url": "https://google.com"
}
```

---

# 📋 Backlog Técnico e Melhorias Mapeadas (Tech Debt)

## 1. Banco de Dados e Performance

- Indexação para colunas muito consultadas (ex: `existsByUrl`)  
- Soft Delete com coluna `deleted_at`  
- Otimização de consultas (ex: `findAllByIsActiveTrue`)  

---

## 2. Resiliência e Monitoramento (Scheduler)

- Substituir `fixedRate` por `fixedDelay`  
- Melhorar gerenciamento de threads (Bean/constante)  
- Uso de `@Transactional` para consistência  

---

## 3. Refatoração de Código e Boas Práticas

- Testes unitários com JUnit e Mockito  
- Separação de DTOs (Request/Response)  
- Regras de negócio fora de Controllers  
- Logs transacionais  

---

## 4. Segurança e Fluxo de Autenticação

- Separar login e cadastro  
- Melhorar tratamento de JWT  
- Ajustes de timezone  

---

# ✅ Status do Projeto

- ✔️ Arquitetura sólida e Clean Code  
- ✔️ Segurança corporativa  
- ✔️ Monitoramento automático e concorrente  
- ✔️ Persistência confiável de falhas  

---

## ⏳ Em Progresso

- Resolução de backlog técnico  
- Implementação de testes  
