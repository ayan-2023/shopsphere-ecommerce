# 🛒 ShopSphere — Production-Ready Full-Stack E-Commerce & DevSecOps Platform

[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![Docker](https://img.shields.io/badge/Container-Docker%20Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Registry](https://img.shields.io/badge/Registry-GHCR-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/features/packages)
[![Cloud](https://img.shields.io/badge/Cloud-Microsoft%20Azure-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com/)
[![OS](https://img.shields.io/badge/OS-Ubuntu%2024.04%20LTS-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)](https://ubuntu.com/)
[![Security](https://img.shields.io/badge/Security-DevSecOps%20Hardened-4CAF50?style=for-the-badge&logo=securityscorecard&logoColor=white)](#-security--devsecops)

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%2020%20%2B%20Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%208.0-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Nginx](https://img.shields.io/badge/Reverse%20Proxy-Nginx%20Alpine-009639?style=flat-square&logo=nginx&logoColor=white)](https://nginx.org/)
[![Semgrep](https://img.shields.io/badge/SAST-Semgrep-00B0FF?style=flat-square&logo=semgrep&logoColor=white)](https://semgrep.dev/)
[![Gitleaks](https://img.shields.io/badge/Secret%20Scan-Gitleaks-critical?style=flat-square&logo=git&logoColor=white)](https://github.com/gitleaks/gitleaks)
[![Trivy](https://img.shields.io/badge/Container%20Scan-Aqua%20Trivy-1904DA?style=flat-square&logo=aqua&logoColor=white)](https://trivy.dev/)

---

## 📌 Project Overview

**ShopSphere** is an enterprise-grade, three-tier e-commerce web platform engineered with modern full-stack technologies and a continuous security, containerized deployment (DevSecOps) lifecycle. 

Built to showcase modern engineering standards, ShopSphere goes beyond standard CRUD functionality by coupling a responsive, feature-rich customer & admin shopping experience with an automated, zero-trust continuous delivery pipeline deployed onto a hardened **Microsoft Azure Ubuntu 24.04 VM**.

### Architectural Pillars:
1. **Application Layer**: Single Page Application (SPA) frontend in React 18 / Vite with reverse proxy routing, paired with a RESTful Express.js microservice API.
2. **Persistence Layer**: ACID-compliant relational persistence via MySQL 8.0 featuring transactional isolation for checkout, order lifecycle management, and inventory synchronization.
3. **Container & Cloud Infrastructure**: Multi-stage, non-root Alpine container images distributed through GitHub Container Registry (GHCR) and orchestrated via Docker Compose.
4. **DevSecOps Pipeline**: End-to-end GitHub Actions workflow enforcing automated code syntax verification, repository secret detection (Gitleaks), static application security testing (Semgrep), and container vulnerability gating (Aqua Trivy) before SSH automated rollout with rollback-grade health verification.

---

## 🎯 Project Goals

- **Production-Style Three-Tier Architecture**: Clean separation of presentation (React), business logic (Node.js/Express), and relational persistence (MySQL 8).
- **Shift-Left Security (DevSecOps)**: Automate security scanning at every gate — pre-commit git secrets, static code analysis, and CVE vulnerability scanning inside container images.
- **Reliable Continuous Delivery**: Eliminate manual deployments using automated GitHub Actions CI/CD to build, test, scan, push to GHCR, and roll out onto Azure over encrypted SSH.
- **Strict Data Integrity**: Implement ACID transactions to prevent overselling, race conditions during simultaneous checkouts, and illegitimate modifications to delivered orders.
- **Minimal Attack Surface**: Implement hardened, minimal Alpine base images running under non-root users (`USER node`) with development utilities removed (`npm` stripped from runtime images).
- **High Availability & Predictable Recovery**: Zero-configuration container orchestration with declarative environment files, health check dependency chaining, and persistent volume backups.

---

## ✨ Key Features

### 🛍️ Customer Experience
- **Authentication & Authorization**: Fast registration and login secured with JWT tokens and bcrypt password hashing.
- **Product Discovery & Navigation**: Live search, category filtering, price range filters, and dynamic sorting.
- **Product Details & Ratings**: Rich product view with high-resolution image fallbacks, descriptions, discount computation, and customer reviews.
- **Cart & Wishlist Engine**: Stateful shopping cart with immediate stock boundary checks, wishlist bookmarking with duplicate protection.
- **Resilient Checkout Process**: Form validation for phone numbers and delivery pincodes, delivery address assignment, and payment method selection.
- **Order Tracking & History**: User-specific order dashboard displaying chronological purchase history, item breakdown, and current delivery statuses (`pending`, `processing`, `shipped`, `delivered`, `cancelled`).
- **Verified Review Submission**: Review submission permitted exclusively on delivered purchases, preventing fake or duplicate feedback.

### 🛡️ Admin Management
- **Role-Based Admin Access**: Administrative protection via `role = 'admin'` middleware enforcement.
- **Operational Dashboard**: Real-time sales metrics, revenue analytics, customer counts, and total order volume.
- **Product Lifecycle (CRUD)**: Create, update, categorize, price, and adjust inventory for store merchandise with input validation.
- **Order Lifecycle Management**: Transition order states across the pipeline (`pending` ➔ `processing` ➔ `shipped` ➔ `delivered` ➔ `cancelled`).
- **Delivered Order Immutability**: Built-in protection preventing modification or cancellation of completed orders.
- **Automated Stock Restoration**: Intelligent cancellation flow that automatically returns allocated inventory back to the active catalog within a database transaction.

### 🔐 Security Features
- **Secret Scanning**: Continuous repository inspection via Gitleaks to block exposed credentials and API keys.
- **Static Application Security Testing (SAST)**: Automated Semgrep rulesets analyzing JavaScript code for security vulnerabilities.
- **Image Vulnerability Scanning**: Aqua Trivy scans of Docker images failing CI builds on unmitigated `HIGH` or `CRITICAL` CVEs.
- **Brute-Force Rate Limiting**: Express authentication endpoints enforce a rate-limiting threshold (5 attempts per 15-minute window).
- **Container Hardening**: Multi-stage Docker builds executing under unprivileged `node` user with runtime build tools pruned.
- **Database Sanitization**: Parameterized queries via `mysql2/promise` preventing SQL injection.

### ⚙️ DevOps & Cloud Features
- **Centralized Image Distribution**: Versioned and tagged image publishing to GitHub Container Registry (`ghcr.io`).
- **Automated SSH Cloud Deployment**: GitHub Actions directly connects to Microsoft Azure VM, pulls updated images, and recreates services.
- **Zero-Downtime Health Verifications**: Automated post-deployment polling loop querying `/api/health` before confirming pipeline success.
- **Reverse Proxy Architecture**: Nginx Alpine reverse-proxies `/api/` requests to Express while natively serving optimized React SPA static assets.

---

## 🏗️ System Architecture

The application adopts a three-tier decoupled architecture hosted inside an isolated Docker network on an Azure Virtual Machine:

```
                                  +-------------------------------------------------------------+
                                  |                     CLIENT / WEB BROWSER                   |
                                  +------------------------------+------------------------------+
                                                                 |
                                                          HTTP:3000 / HTTPS
                                                                 |
=================================================================V=================================================================
MICROSOFT AZURE UBUNTU 24.04 LTS VM (Docker Compose Network: shopsphere-network)
===================================================================================================================================
  |
  |-- [ Frontend Container: shopsphere-frontend ] ----------------------------------------------+
  |   - Base: nginx:alpine                                                                      |
  |   - Serves React 18 production bundle (Vite build)                                          |
  |   - SPA Fallback routing (try_files $uri $uri/ /index.html)                                 |
  |   - Reverse Proxy: Proxy passes /api/* requests to backend:5000                             |
  |                                                                                             |
  +----------------------------------------------+----------------------------------------------+
                                                 |
                                         Internal HTTP :5000
                                                 |
  +----------------------------------------------V----------------------------------------------+
  |-- [ Backend Container: shopsphere-backend ] ------------------------------------------------+
  |   - Base: node:20-alpine (Multi-stage build, USER node, npm removed)                        |
  |   - Express.js REST API with CORS, rate-limiting & JWT verification                         |
  |   - Transactional business logic (Orders, Inventory, Reviews, Wishlist)                     |
  |   - Endpoints: /api/auth, /api/products, /api/cart, /api/orders, /api/health                |
  +----------------------------------------------+----------------------------------------------+
                                                 |
                                         Internal MySQL :3306
                                                 |
  +----------------------------------------------V----------------------------------------------+
  |-- [ Database Container: shopsphere-mysql ] -------------------------------------------------+
  |   - Base: mysql:8.0                                                                         |
  |   - Initialized schema: schema.sql (schema + seed data)                                     |
  |   - Persistent Data Volume: mysql_data -> /var/lib/mysql                                    |
  |   - Healthcheck: mysqladmin ping -h localhost -uroot -p${MYSQL_ROOT_PASSWORD}               |
  +---------------------------------------------------------------------------------------------+
```

### Architectural Flow Breakdown:
1. **Client Tier**: Web browsers interact with port `3000` exposed on the Azure VM.
2. **Reverse Proxy & Frontend**: Nginx acts as the single entry point. Static file requests (`/`, `/index.html`, `/assets/*`) are served directly with caching headers. API calls matching `/api/*` are reverse-proxied internally to `http://backend:5000/api/`.
3. **Application Tier**: The Express application validates requests, enforces rate-limiting on authentication routes, decodes JWT payloads, and executes business logic.
4. **Data Tier**: Express interacts with the MySQL container through connection pooling (`mysql2/promise`). Container startup order is strictly managed via Docker Compose healthchecks (`depends_on.condition: service_healthy`).

---

## 🔄 CI/CD + DevSecOps Pipeline

The deployment pipeline is orchestrated using **GitHub Actions** (`.github/workflows/ci-cd.yml`), triggering automatically on pushes and pull requests to `main`:

```
+---------------------------------------------------------------------------------------------------------+
|                                    GITHUB ACTIONS WORKFLOW EXECUTION                                     |
+---------------------------------------------------------------------------------------------------------+
       |                                      |                                    |
       V                                      V                                    V
+--------------+                      +---------------+                    +---------------+
|  Backend CI  |                      |  Frontend CI  |                    | Gitleaks Scan |
|--------------|                      |---------------|                    |---------------|
| • Node 20    |                      | • Node 20     |                    | • Full commit |
| • npm ci     |                      | • npm ci      |                    |   history     |
| • Syntax chk |                      | • Vite build  |                    | • Detect keys |
+-------+------+                      +-------+-------+                    +-------+-------+
        |                                     |                                    |
        +-------------------------------------+------------------------------------+
                                              |
                                              V
                                    +-------------------+
                                    |    Semgrep SAST   |
                                    |-------------------|
                                    | • JS Security     |
                                    |   Vulnerability   |
                                    |   Ruleset Scan    |
                                    +---------+---------+
                                              |
                                              V
                               +-----------------------------+
                               |     Docker Security Scan    |
                               |-----------------------------|
                               | • Build backend:ci image    |
                               | • Build frontend:ci image   |
                               | • Aqua Trivy Scan: backend  |
                               | • Aqua Trivy Scan: frontend |
                               |   (Fails on HIGH,CRITICAL)  |
                               +--------------+--------------+
                                              |
                                              V
                               +-----------------------------+
                               |       Publish to GHCR       |
                               |-----------------------------|
                               | • ghcr.io tag: ${SHA}       |
                               | • ghcr.io tag: latest       |
                               | • Push backend & frontend   |
                               +--------------+--------------+
                                              |
                                              V
                               +-----------------------------+
                               |       SSH Azure Deploy      |
                               |-----------------------------|
                               | • Appleboy SSH to Azure VM  |
                               | • docker compose pull       |
                               | • docker compose up -d      |
                               |   --force-recreate          |
                               +--------------+--------------+
                                              |
                                              V
                               +-----------------------------+
                               |      Live Health Check      |
                               |-----------------------------|
                               | • GET /api/health loop      |
                               | • 12 retries (5s interval)  |
                               | • 60s timeout verification  |
                               +-----------------------------+
```

### Detailed Pipeline Stages:
1. **Backend CI**: Checks out code, sets up Node.js 20 with npm caching, installs exact dependencies via `npm ci`, and runs static node syntax validation (`node --check src/server.js`).
2. **Frontend CI**: Checks out code, restores cache, installs dependencies via `npm ci`, and executes the production Vite build (`npm run build`).
3. **Secret Scan (Gitleaks)**: Scans the entire git history (`fetch-depth: 0`) using `gitleaks-action` to ensure no API tokens, SSH keys, or passwords exist in commits.
4. **SAST Scan (Semgrep)**: Analyzes source code using the `p/javascript` security ruleset to catch cross-site scripting (XSS), insecure deserialization, and dangerous method invocations.
5. **Docker Build & Trivy Scan**: Builds local CI images for both tiers. Aqua Security's `trivy-action` scans both images with `--severity CRITICAL,HIGH` and `--exit-code 1`, halting the workflow if unpatched vulnerabilities exist.
6. **Publish to GitHub Container Registry (GHCR)**: Authenticates to `ghcr.io`, normalizes repository owner names to lowercase, tags images with both git commit SHA and `latest`, and pushes both artifacts.
7. **SSH Azure Deployment**: Connects to the Azure Ubuntu VM using `appleboy/ssh-action` with an encrypted private key stored in GitHub Secrets. Pulls latest images and forces recreation of `backend` and `frontend` containers.
8. **Automated Health Verification**: Runs an iterative health polling probe against `http://localhost:3000/api/health` with 12 retry iterations (5-second intervals). Fails the workflow if the application does not report healthy within 60 seconds.

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React.js | `18.3.1` | Component-based interactive UI with responsive layouts |
| **Build Tooling** | Vite | `5.4.2` | Fast bundling, HMR, and optimized static asset generation |
| **Icons & UI** | Lucide React | `0.441.0` | Accessible, lightweight icon components |
| **Client Routing** | React Router DOM | `6.26.2` | Client-side routing, protected customer/admin routes |
| **Backend Runtime** | Node.js | `20.x (Alpine)` | High-performance, asynchronous server runtime |
| **Web Framework** | Express.js | `4.19.2` | RESTful API routing, error middleware, controller handlers |
| **Database** | MySQL Server | `8.0` | Relational storage, ACID transaction isolation, foreign keys |
| **DB Driver** | mysql2/promise | `3.10.0` | High-performance async connection pooling and prepared statements |
| **Authentication** | JSON Web Tokens | `9.0.2` | Stateless bearer token authentication |
| **Password Hashing**| bcryptjs | `2.4.3` | Salted hashing for user passwords |
| **Rate Limiting** | express-rate-limit | `8.7.0` | DDoS and brute-force mitigation on authentication endpoints |
| **Reverse Proxy** | Nginx | `Alpine` | Static file delivery and reverse proxy to Express container |
| **Container Engine** | Docker & Compose | `v2+` | Multi-container declarative orchestration and isolation |
| **Registry** | GitHub Packages | `GHCR` | Secure, private container registry for built images |
| **Cloud Hosting** | Microsoft Azure | `Ubuntu 24.04` | Enterprise VM infrastructure for hosting container workloads |
| **Security SAST** | Semgrep | `v1` | Static application security testing against JavaScript standards |
| **Secret Detection**| Gitleaks | `v3` | Continuous scanning for exposed keys, credentials, and tokens |
| **Image Vulnerability**| Aqua Trivy | `v0.x` | CVE vulnerability scanning for base OS and container dependencies |

---

## 🐳 Docker Architecture

Every component in ShopSphere is containerized for deterministic behavior across local development and production cloud environments:

```
shopsphere-ecommerce/
 ├── backend/Dockerfile     --> Multi-stage Node 20 Alpine (production dependencies, USER node)
 ├── frontend/Dockerfile    --> Multi-stage (Node 20 build -> Nginx Alpine runtime)
 ├── frontend/nginx.conf    --> Reverse proxy & SPA routing configuration
 └── docker-compose.yml     --> Orchestrates mysql, backend, and frontend containers
```

### 1. Backend Container (`shopsphere-backend`)
- **Base Image**: `node:20-alpine`
- **Multi-Stage Build Pattern**:
  - *Stage 1 (`dependencies`)*: Runs `npm ci --omit=dev` to install only production dependencies.
  - *Stage 2 (`production`)*: Copies the production `node_modules` into a clean Alpine image, updates the system packages, removes `npm` entirely (`rm -rf /usr/local/lib/node_modules/npm`) to reduce attack surface and container size, and drops privileges to `USER node`.
- **Exposed Port**: `5000` (internal Docker network).

### 2. Frontend Container (`shopsphere-frontend`)
- **Multi-Stage Build Pattern**:
  - *Stage 1 (`build`)*: Builds the React application using Vite (`npm ci` followed by `npm run build`), generating compiled HTML/JS/CSS into `/app/dist`.
  - *Stage 2 (`runtime`)*: Minimal `nginx:alpine` image. Removes default HTML, copies the compiled bundle into `/usr/share/nginx/html`, and applies custom `nginx.conf`.
- **Exposed Port**: Port `80` internally, mapped to host port `3000` (configurable via `FRONTEND_PORT`).

### 3. Database Container (`shopsphere-mysql`)
- **Base Image**: `mysql:8.0`
- **Initialization**: Automatically mounts `./database/schema.sql` into `/docker-entrypoint-initdb.d/schema.sql:ro` during initial startup to build tables and load seed categories and demo data.
- **Persistence**: Managed through the named Docker volume `mysql_data` mounted at `/var/lib/mysql`.
- **Healthcheck**: Configured with `mysqladmin ping` every 5 seconds to ensure the database is fully operational before the backend container boots.

### 4. Nginx Reverse Proxy Configuration
```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Reverse proxy API requests to Express backend
    location /api/ {
        proxy_pass http://backend:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # React SPA routing fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets
    location /images/ {
        try_files $uri =404;
    }
}
```

---

## ☁️ Azure Deployment

The production environment is hosted on a hardened **Microsoft Azure Virtual Machine**:

- **Operating System**: Ubuntu 24.04 LTS
- **Compute Sizing**: Standard B2s / D2s_v5 or equivalent (2 vCPU, 4GB+ RAM)
- **Networking & Ingress**: Azure Network Security Group (NSG) configured with inbound rules for:
  - Port `22` (SSH management restricted by IP)
  - Port `3000` / `80` (HTTP Web traffic)
- **Container Host**: Docker Engine + Docker Compose Plugin

```
[ GitHub Actions Runner ]
        |
        | 1. Encrypted SSH (appleboy/ssh-action)
        v
[ Azure Ubuntu 24.04 VM (/home/devopsadmin/shopsphere-ecommerce) ]
        |
        +-- 2. Pull images: docker compose pull backend frontend
        +-- 3. Recreate: docker compose up -d --force-recreate backend frontend
        +-- 4. Healthcheck: curl -fsS http://localhost:3000/api/health (retry 12x)
```

The Azure VM holds a production clone of the repository configuration (`docker-compose.yml`, `database/schema.sql`, and an untracked `.env` file containing production secrets). The GitHub Actions CI/CD pipeline establishes an automated SSH session to pull the newly built images from GHCR and reload containers without requiring full server restarts.

---

## 📦 GitHub Container Registry

Production container images are automatically built, scanned, tagged, and published to GitHub Container Registry:

| Service | GHCR Image Identifier | Tags |
| :--- | :--- | :--- |
| **Backend API** | `ghcr.io/ayan-2023/shopsphere-backend` | `latest`, `${GITHUB_SHA}` |
| **Frontend Web** | `ghcr.io/ayan-2023/shopsphere-frontend` | `latest`, `${GITHUB_SHA}` |

Both images are published under the repository owner's GitHub namespace and can be inspected in the repository's **Packages** tab.

---

## 🔐 Security & DevSecOps

ShopSphere implements a defense-in-depth security posture spanning source code, build pipelines, runtime containers, and persistent storage:

```
[ Pre-Commit / Push ] ---> [ Static Analysis & SAST ] ---> [ Container Image Scan ] ---> [ Hardened Runtime ]
  • Gitleaks Secrets         • Semgrep JS Rulesets          • Aqua Trivy (CVEs)           • Non-root user (node)
  • No Plaintext Env         • Input Type Checking          • Block High/Critical         • Rate Limiting (5/15m)
  • .gitignore Safeguards    • SQL Injection Defense        • Production-Only Deps        • JWT & bcrypt Hashing
```

### Security Controls Matrix:
- **Gitleaks Secret Detection**: Scans the git tree on every push to prevent credentials, secrets, or certificates from entering version control.
- **Semgrep SAST**: Performs automated AST code analysis on JavaScript to flag vulnerabilities like SQL injection, prototype pollution, and hardcoded secrets.
- **Trivy Container Scanning**: Analyzes base image layers and OS packages in both backend and frontend images. Builds fail automatically if unfixed `HIGH` or `CRITICAL` CVEs exist.
- **Cryptographic Password Storage**: Passwords hashed using `bcryptjs` with standard work factor salts.
- **Stateless JWT Authorization**: Tokens signed with high-entropy secrets and verified on all protected `/api/*` endpoints.
- **Authentication Rate Limiting**: The `/api/auth` endpoint limits authentication attempts to 5 requests per 15-minute window per IP to prevent dictionary and credential-stuffing attacks.
- **Role-Based Access Control (RBAC)**: Protected routes verify `req.user.role === 'admin'` before granting access to administrative operations or dashboard analytics.
- **Non-Root Runtime**: Backend execution runs under unprivileged `USER node` (UID 1000) inside Docker, preventing privilege escalation vulnerabilities.
- **Attack Surface Minimization**: Package manager binaries (`npm`) are purged from the production container layer, denying attackers runtime installation tools.
- **Parameterized Relational Queries**: All MySQL queries utilize prepared statement parameters (`connection.execute(query, [params])`) to eliminate SQL injection vectors.
- **Zero Credentials in Git**: All sensitive variables are loaded via local `.env` files or injected through GitHub Actions Secrets.

---

## 🗄️ Database

ShopSphere utilizes **MySQL 8.0** with strict transactional controls and foreign key constraints:

### Entity Relationship & Core Tables:

```
  +--------------+          +-------------------+          +------------------+
  |    users     |<-------->|       cart        |<-------->|    cart_items    |
  |--------------| 1      1 |-------------------| 1      N |------------------|
  | id (PK)      |          | id (PK)           |          | id (PK)          |
  | email (UQ)   |          | user_id (FK)      |          | cart_id (FK)     |
  | role (enum)  |          +-------------------+          | product_id (FK)  |
  +-------+------+                                         | quantity         |
          |                                                +--------+---------+
          | 1                                                       |
          |                                                         | N
          | N                                                       V
  +-------V------+          +-------------------+          +--------+---------+
  |    orders    |<-------->|    order_items    |          |     products     |
  |--------------| 1      N |-------------------| N      1 |------------------|
  | id (PK)      |          | id (PK)           |--------->| id (PK)          |
  | user_id (FK) |          | order_id (FK)     |          | category_id (FK) |
  | total_amount |          | product_id (FK)   |          | price, stock     |
  | status       |          | quantity, price   |          +--------^---------+
  +-------+------+          +-------------------+                   |
          |                                                         | 1
          | 1                                                       |
          |                                                +--------+---------+
          | N                                              |    categories    |
  +-------V------+          +-------------------+          |------------------|
  |   reviews    |          |     wishlist      |          | id (PK)          |
  |--------------|          |-------------------|          | name (UQ)        |
  | id (PK)      |          | id (PK)           |          +------------------+
  | order_id(FK) |          | user_id (FK)      |
  | prod_id (FK) |          | product_id (FK)   |
  | user_id (FK) |          +-------------------+
  +--------------+
```

### Table Breakdown:
- `users`: User identity, credential hash, role designation (`user` | `admin`), and registration timestamps.
- `categories`: Taxonomy for catalog management with unique category names and imagery.
- `products`: Product inventory records containing price, discount, rating counters, and live stock levels.
- `cart`: One-to-one user shopping cart container.
- `cart_items`: Cart items with composite uniqueness (`cart_id`, `product_id`) and quantity tracking.
- `orders`: Purchase order headers tracking customer information, total amount, shipping addresses, payment method, and state (`pending`, `processing`, `shipped`, `delivered`, `cancelled`).
- `order_items`: Line-item snapshots capturing product ID, purchased quantity, and the locked historical purchase price.
- `reviews`: Verified purchase feedback constrained to 1-5 rating values with unique restriction `(user_id, product_id, order_id)`.
- `wishlist`: Customer product bookmarks with duplicate prevention `UNIQUE KEY (user_id, product_id)`.

### Transactional Integrity & Inventory Handling:
- **Order Placement**: Uses MySQL transactions (`connection.beginTransaction()`). Validates active stock for every cart item. Atomically reduces `products.stock`, generates `orders` and `order_items` records, clears the active `cart_items`, and commits. If any product has insufficient stock, the transaction is rolled back.
- **Order Cancellation**: If an active order is transitioned to `cancelled`, an atomic transaction loops through `order_items` and increments product inventory back to available stock.
- **Delivered Order Immutability**: Orders marked `delivered` are locked against modification or cancellation.

---

## 🚀 Local Development Setup

Follow these steps to run ShopSphere locally without Docker.

### Prerequisites:
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **MySQL Server**: `8.0` running locally on port `3306`

### 1. Clone the Repository
```bash
git clone https://github.com/ayan-2023/shopsphere-ecommerce.git
cd shopsphere-ecommerce
```

### 2. Configure Environment Variables
Create a root `.env` file from the provided `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` to match your local setup:
```env
MYSQL_ROOT_PASSWORD=your_local_root_password
MYSQL_DATABASE=shopsphere

DB_USER=shopsphere_app
DB_PASSWORD=your_strong_app_password

JWT_SECRET=your_strong_jwt_secret
JWT_EXPIRES_IN=7d

BACKEND_PORT=5000
FRONTEND_PORT=3000
MYSQL_PORT=3306
```

### 3. Initialize the Database
Open MySQL CLI or your preferred database tool and import the schema:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS shopsphere;"
mysql -u root -p shopsphere < database/schema.sql
```

### 4. Install & Start Backend
Open a terminal for the backend:
```bash
cd backend
npm install
npm run dev
```
*The backend server will start at `http://localhost:5000`.*

### 5. Install & Start Frontend
Open a separate terminal for the frontend:
```bash
cd frontend
npm install
npm run dev
```
*The frontend Vite dev server will start at `http://localhost:5173` (or port indicated in the terminal).*

---

## 🐳 Docker Deployment

The fastest and most reliable way to run the entire application stack locally is using **Docker Compose**.

### Prerequisites:
- **Docker Engine**: `24.0+`
- **Docker Compose**: `v2.20+`

### 1. Configure `.env`
Ensure your `.env` file exists in the project root:
```bash
cp .env.example .env
```

### 2. Launch the Application Stack
Start all services in detached mode:
```bash
docker compose up -d
```

### 3. Verify Container Status
Check that all three containers are running and healthy:
```bash
docker compose ps
```

Expected output:
```
NAME                  IMAGE                                             COMMAND                  SERVICE    STATUS              PORTS
shopsphere-mysql      mysql:8.0                                         "docker-entrypoint.s…"   mysql      running (healthy)   3306/tcp
shopsphere-backend    ghcr.io/ayan-2023/shopsphere-backend:latest       "node src/server.js"     backend    running             5000/tcp
shopsphere-frontend   ghcr.io/ayan-2023/shopsphere-frontend:latest      "nginx -g 'daemon of…"   frontend   running             0.0.0.0:3000->80/tcp
```

### 4. Access the Application
- **Frontend Web UI**: [http://localhost:3000](http://localhost:3000)
- **Backend Health Check**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

### 5. Stop the Application
To stop all containers while preserving database volume data:
```bash
docker compose down
```

To stop containers and delete the database volume:
```bash
docker compose down -v
```

---

## ❤️ Health Check

The backend includes a dedicated health check endpoint for container orchestrators, uptime monitors, and CI/CD deployment verification:

### HTTP Request:
```http
GET /api/health HTTP/1.1
Host: localhost:3000
```

### Example Successful Response (`200 OK`):
```json
{
  "success": true,
  "message": "ShopSphere API is running"
}
```

This endpoint is verified directly by the GitHub Actions pipeline during the Azure deployment phase.

---

## 🧪 Verification & Testing

Verify that the local or deployed container stack is functioning as expected using the following commands:

```bash
# 1. Check container execution status
docker compose ps

# 2. Query the backend health check through Nginx reverse proxy
curl -i http://localhost:3000/api/health

# 3. Check frontend Nginx HTTP header response
curl -I http://localhost:3000

# 4. Inspect real-time application logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql
```

---

## 🔧 Useful Commands

<details>
<summary><strong>Click to expand Docker, Compose, and Git operations</strong></summary>

### Docker & Docker Compose Commands
```bash
# Rebuild containers locally after code changes
docker compose build --no-cache

# Start specific services
docker compose up -d backend frontend

# View logs for a specific service
docker compose logs -f --tail=100 backend

# Execute a shell inside the backend container
docker compose exec backend sh

# Execute a MySQL interactive shell
docker compose exec mysql mysql -u root -p shopsphere

# Inspect container network
docker network inspect shopsphere-ecommerce_default
```

### Development Clean-Up Commands
```bash
# Remove dangling images
docker image prune -f

# Completely reset local Docker environment for the project
docker compose down -v --rmi all
```

### Git & Security Verification Commands
```bash
# Verify backend code syntax
cd backend && node --check src/server.js

# Build frontend production bundle locally
cd frontend && npm run build

# Run local Gitleaks detection
gitleaks detect --source . -v
```
</details>

---

## 🧯 Troubleshooting

| Symptom | Probable Cause | Recommended Resolution |
| :--- | :--- | :--- |
| **Backend container fails to start** | Database not ready or bad DB credentials | Check backend logs: `docker compose logs backend`. Ensure `shopsphere-mysql` container status is `(healthy)`. Verify DB credentials in `.env`. |
| **Frontend displays `502 Bad Gateway`** | Backend service is unreachable from Nginx | Verify backend container is running: `docker compose ps`. Test backend directly: `docker compose exec frontend wget -qO- http://backend:5000/api/health`. |
| **MySQL connection refused (`ECONNREFUSED`)** | MySQL is still initializing or port collision | Verify MySQL logs: `docker compose logs mysql`. Ensure host port `3306` or `3307` is not already in use by a local database instance. |
| **CI/CD fails at Trivy Scan stage** | Vulnerable package detected in image | Run Trivy locally to identify the CVE: `trivy image shopsphere-backend:ci`. Update base image or vulnerable npm dependencies in `package.json`. |
| **CI/CD fails during SSH Deployment** | Incorrect SSH secrets or Azure VM firewall | Verify GitHub Secrets: `VM_HOST`, `VM_USER`, `VM_SSH_KEY`. Ensure Azure NSG allows inbound SSH on port 22 from GitHub IP ranges. |
| **Image pull error (`403 Forbidden` / `404`)** | GHCR package permissions | Ensure the GitHub Actions workflow has `packages: write` permissions. Verify image owner matches lowercase GitHub username. |
| **Health check retry loop timeout** | Backend taking too long to connect to MySQL | Inspect Azure VM logs via SSH: `docker compose logs -t backend`. Ensure the database container volume is healthy and not corrupted. |

---

## 🔒 Secrets & Security Notes

> [!IMPORTANT]
> **Never commit real secrets or `.env` files into version control.**

All configuration parameters in this repository are managed through environment variables. Production deployments rely on:

1. **GitHub Actions Secrets**:
   - `VM_HOST`: Public IP address or FQDN of the Azure Virtual Machine.
   - `VM_USER`: SSH administrative user (e.g., `devopsadmin`).
   - `VM_SSH_KEY`: Private SSH key matching the public key on the VM.
   - `GITHUB_TOKEN`: Built-in GitHub token for GHCR publishing.

2. **Server-Side Environment (`.env`)**:
   - Located on the Azure VM host at `/home/devopsadmin/shopsphere-ecommerce/.env`.
   - Never tracked by Git (protected by `.gitignore`).

---

## 📸 Screenshots

*Application screenshots and pipeline artifacts:*

| Interface / Component | Preview |
| :--- | :--- |
| **Storefront Home Page** | ![Home Page](docs/images/homepage.png) |
| **Product Catalog & Filters** | ![Product Catalog](docs/images/products.png) |
| **Product Details View** | ![Product Details](docs/images/product-details.png) |
| **Cart & Checkout Process** | ![Cart & Checkout](docs/images/cart-checkout.png) |
| **Admin Operations Dashboard**| ![Admin Dashboard](docs/images/admin-dashboard.png) |
| **GitHub Actions CI/CD Run** | ![GitHub Actions](docs/images/github-actions.png) |
| **GitHub Container Registry** | ![GHCR Packages](docs/images/ghcr-packages.png) |
| **Azure VM Production Rollout**| ![Azure Deployment](docs/images/azure-vm-deployment.png) |

*(To populate screenshots, place corresponding `.png` files in the `docs/images/` directory.)*

---

## 📁 Documentation

Detailed architectural and operational documentation can be organized under the `docs/` folder:

- 📑 [`docs/architecture.md`](docs/architecture.md) — Deep-dive system architecture, network topologies, and data flows.
- 📑 [`docs/cicd.md`](docs/cicd.md) — Comprehensive guide to GitHub Actions workflow jobs and trigger strategies.
- 📑 [`docs/docker.md`](docs/docker.md) — Multi-stage Dockerfile explanations, layer optimization, and image pruning.
- 📑 [`docs/deployment.md`](docs/deployment.md) — Azure Ubuntu VM provisioning, NSG firewall rules, and SSH setup.
- 📑 [`docs/security.md`](docs/security.md) — SAST, secret scanning, Trivy vulnerability baselines, and RBAC implementation.
- 📑 [`docs/troubleshooting.md`](docs/troubleshooting.md) — Incident playbooks, container diagnostics, and disaster recovery.

---

## 🚀 Future Improvements

Planned enhancements to elevate the infrastructure and application lifecycle:

- [ ] **Infrastructure as Code (IaC)**: Provision Azure VM, NSG, and networking using HashiCorp Terraform.
- [ ] **Kubernetes Migration**: Transition from Docker Compose to Kubernetes (AKS) with Helm charts.
- [ ] **SSL / TLS Termination**: Automated Let's Encrypt certificates using Certbot or Cloudflare integration.
- [ ] **Cloud Secret Management**: Centralize secret rotation using Azure Key Vault.
- [ ] **Observability Stack**: Deploy Prometheus and Grafana for metrics collection and visual dashboards.
- [ ] **Centralized Logging**: Integrate Grafana Loki or ELK (Elasticsearch, Logstash, Kibana) for unified log streams.
- [ ] **Automated Backups**: Scheduled Azure Blob Storage snapshots of the MySQL database.
- [ ] **Zero-Downtime Rollouts**: Implement blue-green or canary deployment strategies.
- [ ] **Supply Chain Security**: Implement Cosign container image signing and Software Bill of Materials (SBOM) generation.

---

## 👨‍💻 Author

**Ayan Jana**  
*Full-Stack & DevOps Engineer*

- 🐙 **GitHub**: [ayan-2023](https://github.com/ayan-2023)
- 💼 **LinkedIn**: [Ayan Jana](https://linkedin.com/in/<your-linkedin-profile>)
- 📧 **Contact**: `ayanjana2026@gmail.com`

---

## ⭐ Closing Statement

**ShopSphere** demonstrates an end-to-end implementation of modern cloud-native engineering: bridging dynamic full-stack development, declarative container orchestration, shift-left DevSecOps automation, and automated cloud delivery onto Microsoft Azure.

If you find this project informative or useful for your own DevOps journey, please consider starring ⭐ the repository!
