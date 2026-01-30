# HealthCheck API

## 📌 Visão Geral

O **HealthCheck** é uma API RESTful profissional para **monitoramento automatizado de disponibilidade de URLs**, desenvolvida em **Java 21** com **Spring Boot 3.4.1**. O sistema realiza verificações periódicas em URLs cadastradas, identifica quedas (downtime), registra incidentes de forma inteligente e mantém um histórico confiável de indisponibilidade.

O projeto foi pensado com **foco em arquitetura limpa, segurança, escalabilidade e boas práticas corporativas**, seguindo princípios **SOLID**, separação clara de responsabilidades e padrões amplamente utilizados em ambientes de produção.

---

## 🏗️ Arquitetura do Sistema

A aplicação segue o **padrão de arquitetura em camadas**, garantindo baixo acoplamento e alta manutenibilidade:

- **Controller**: Exposição das rotas REST
- **Service**: Regras de negócio e orquestração
- **Repository**: Persistência de dados
- **Entity (Model)**: Representação do domínio

### 🔐 Segurança e Autenticação

- **Spring Security** com autenticação **Stateless**
- **JWT (JSON Web Token)** utilizando **Auth0 Java-JWT**
- Assinatura com algoritmo **HMAC256**
- Tokens interceptados e validados via `SecurityFilter`
- Senhas criptografadas com **BCryptPasswordEncoder**

Fluxo resumido:
1. Usuário realiza login
2. Token JWT é gerado
3. Token é enviado no header `Authorization: Bearer <token>`
4. O filtro valida e autentica a requisição

### 🛂 Controle de Acesso (RBAC)

Controle de acesso baseado em **Roles** (`UserRole`):

| Role  | Permissões |
|------|-----------|
| ADMIN | Criar, listar e deletar usuários e URLs |
| USER  | Apenas listar recursos |

As permissões são aplicadas diretamente nas rotas via Spring Security.

---

## ⏱️ Monitoramento Automatizado (Scheduler)

O coração do sistema é o **`UrlCheckScheduler`**:

- Executado automaticamente a cada **60 segundos**
- Implementado com `@Scheduled(fixedRate = 60000)`
- Recupera todas as URLs cadastradas no banco
- Executa verificações simultâneas usando `parallelStream()`

### 🌐 Lógica de Verificação

A verificação é realizada pelo **`HealthCheckService`**, utilizando **WebClient reativo**:

- **Status 2xx ou 3xx** → URL considerada **UP**
- **Qualquer outro status ou exceção** (timeout, DNS, conexão) → **DOWN**

### 🧠 Persistência Inteligente de Falhas

O sistema evita registros duplicados:

- Um registro em `outages` é criado **somente quando uma nova falha é detectada**
- Se a URL continuar indisponível, **nenhum novo registro é criado**
- Quando o site volta ao ar:
  - A falha aberta é localizada
  - O campo `end_time` é preenchido
  - O incidente é encerrado corretamente

Isso garante **histórico confiável de downtime**, sem ruído ou dados inflados.

---

## 🗄️ Banco de Dados e Migrações

- **PostgreSQL** como banco relacional
- **Flyway** para versionamento e controle de schema

### Estrutura de Tabelas

- `users`
- `monitored_urls`
- `outages`

### Migrações

- **V1__init.sql**
  - Criação das tabelas
  - Integridade referencial
  - `CASCADE DELETE` para remover outages ao deletar URLs

- **V2__Add_password_to_users.sql**
  - Adiciona coluna `password` para autenticação segura

As migrações são executadas automaticamente na inicialização da aplicação.

---

## 📁 Estrutura do Projeto

```
src/main/java
├── config
│   ├── AppConfig
│   ├── SecurityConfig
│   └── SecurityFilter
│
├── controller
│   ├── AuthController
│   ├── UserController
│   └── MonitoredUrlController
│
├── dto
│   ├── AuthenticationDto
│   └── UserDto
│
├── mapper
│   ├── UserMapper
│   └── MonitoredUrlMapper
│
├── model
│   ├── entity
│   │   ├── User
│   │   ├── MonitoredUrl
│   │   └── Outage
│   └── enums
│       └── UserRole
│
├── repository
│   ├── UserRepository
│   ├── MonitoredUrlRepository
│   └── OutageRepository
│
├── scheduler
│   └── UrlCheckScheduler
│
├── service
│   ├── HealthCheckService
│   ├── TokenService
│   └── UserService
│
└── resources
    └── db/migration
```

---

## 🚀 Guia de Instalação e Execução

### 1️⃣ Clonar o Repositório

O desenvolvimento ocorre na branch **develop**:

```bash
git clone -b develop https://github.com/felipe-mbm/healthcheck.git
cd healthcheck
```

### 2️⃣ Subir o Banco de Dados

O projeto possui `docker-compose.yml` configurado:

```bash
docker-compose up -d
```

- PostgreSQL 15 Alpine
- Porta: `5432`
- Banco padrão: `healthcheck_db`
- Volume persistente: `postgres-data`

### 3️⃣ Configurar Variáveis de Ambiente

Antes de rodar a aplicação, configure:

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/healthcheck_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_LOCATION=classpath:db/migration
JWT_SECRET=sua-chave-secreta-jwt
```

> ⚠️ **Nunca versionar credenciais no repositório**

### 4️⃣ Executar a Aplicação

Com **Java 21** instalado:

```bash
./mvnw spring-boot:run
```

O Flyway aplicará automaticamente as migrações ao iniciar.

---

## 🧪 Guia de Testes (Postman)

### ⚠️ Criação do Primeiro Admin

A rota de criação de usuários é protegida. Crie o primeiro ADMIN manualmente:

```sql
INSERT INTO users (id, email, password, role, check_interval)
VALUES (
  gen_random_uuid(),
  'admin@test.com',
  '$2a$10$HASH_GERADO_PELO_BCRYPT',
  'ADMIN',
  1
);
```

> Alternativamente, libere temporariamente a rota `/users` no `SecurityConfig`.

---

### 🔑 Autenticação

**POST** `/auth/login`

```json
{
  "email": "admin@test.com",
  "password": "123"
}
```

Resposta:
```json
{ "token": "eyJhbGciOi..." }
```

Use este token como **Bearer Token** nas próximas requisições.

---

### 👤 Gerenciamento de Usuários (ADMIN)

- **Criar usuário**: `POST /users`
- **Listar usuários**: `GET /users`
- **Deletar usuário**: `DELETE /users/{id}`

```json
{
  "email": "user@test.com",
  "password": "123",
  "role": "USER"
}
```

---

### 🌍 Gerenciamento de URLs (ADMIN)

- **Cadastrar URL**: `POST /urls`
- **Listar URLs**: `GET /urls`

```json
{
  "name": "Google",
  "url": "https://google.com"
}
```

Os campos `lastStatus` e `lastCheckedAt` são atualizados automaticamente pelo Scheduler.

### 🔻 Simular Queda

- Cadastre uma URL inválida
- Aguarde 1 minuto
- Consulte:
  - Logs da aplicação
  - Tabela `outages` no banco

---

## ✅ Status do Projeto

✔ Arquitetura sólida
✔ Segurança corporativa
✔ Monitoramento automático
✔ Persistência confiável de falhas
✔ Pronto para ambientes reais

---

## 📄 Licença

Este projeto é de uso educacional e interno. Adapte conforme a política da sua organização.

