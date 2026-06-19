# keycloak-react-spring

Projeto de demonstração de autenticação com **Keycloak**, **React** e **Spring Boot**.

O frontend (React) autentica o usuário via Keycloak usando PKCE e chama uma API Spring Boot protegida por JWT.

```
┌─────────────────┐     OIDC/PKCE      ┌──────────────────┐
│  React SPA      │ ◄─────────────────► │  Keycloak        │
│  localhost:3000 │                     │  localhost:9090  │
└────────┬────────┘                     └──────────────────┘
         │  Bearer JWT
         ▼
┌─────────────────┐     valida JWT      ┌──────────────────┐
│  Spring Boot    │ ──────────────────► │  Keycloak        │
│  localhost:8080 │                     │  (issuer-uri)    │
└─────────────────┘                     └──────────────────┘
```

---

## Pré-requisitos

| Ferramenta | Versão utilizada |
|---|---|
| Java (Temurin) | 21.0.10 LTS |
| Maven | 3.9+ |
| Node.js | 24.14.0 |
| npm | incluso com Node |
| Docker | qualquer versão recente |

---

## 1. Keycloak

### 1.1 Subir o container

O `docker-compose.yaml` e o export do realm já estão em `backend/keycloak/`. O Keycloak importa o realm automaticamente na inicialização.

```bash
cd backend/keycloak
docker compose up -d
```

Aguarde o container iniciar e acesse o Admin Console em: http://localhost:9090

> Login: `admin` / `admin`

### 1.2 Criar um usuário de teste

O realm e o client são importados automaticamente. Só é necessário criar um usuário:

1. No menu lateral, selecione o realm importado
2. Vá em **Users** → **Create new user**
3. Preencha **Username** (ex: `usuario-teste`) e clique em **Create**
4. Vá na aba **Credentials** → **Set password**
5. Defina uma senha, desmarque **Temporary** e clique em **Save**

---

## 2. Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

O servidor sobe em http://localhost:8080.

**Endpoints disponíveis:**

| Método | Rota | Autenticação |
|---|---|---|
| GET | `/public` | Não requerida |
| GET | `/private` | JWT obrigatório |

> Na primeira execução o Maven baixa as dependências automaticamente (~1 min). Versão mínima recomendada: **3.9**.

---

## 3. Frontend (React)

```bash
cd frontend
npm install
npm start
```

O servidor de desenvolvimento sobe em http://localhost:3000.

**Funcionalidades:**

- **Login / Logout** via Keycloak (PKCE S256)
- **Chamar endpoint público** — funciona sem autenticação
- **Chamar endpoint privado** — requer login; exibe mensagem de erro caso o backend negar acesso

---

## Ordem recomendada para subir os serviços

```
1. cd backend/keycloak && docker compose up -d   # Keycloak em :9090
2. cd backend && mvn spring-boot:run             # API em :8080
3. cd frontend && npm start                      # SPA em :3000
```

---

## Estrutura do projeto

```
keycloak-react-spring/
├── frontend/                        # React 18 + keycloak-js 26
│   └── src/
│       ├── index.js                 # Inicialização do Keycloak
│       └── App.js                   # UI e chamadas à API
└── backend/                         # Spring Boot 3.5 + Java 21
    ├── keycloak/
    │   ├── docker-compose.yaml      # Container do Keycloak 26.6.3
    │   └── realms/
    │       └── demo-realm-export.json  # Realm importado automaticamente
    └── src/main/
        ├── java/com/example/demo/
        │   ├── HelloController.java
        │   └── SecurityConfig.java
        └── resources/
            └── application.yml
```
