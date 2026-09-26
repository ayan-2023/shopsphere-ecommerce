# 🛠️ ShopSphere — Troubleshooting Guide

This guide provides systematic diagnostic procedures, operational recovery steps, and common error remediations for **ShopSphere**.

---

## 1. Troubleshooting Overview

ShopSphere spans a three-tier containerized stack and an automated cloud CI/CD pipeline:

- **Presentation Layer**: React 18 Single Page Application and Nginx Alpine reverse proxy.
- **Application Layer**: Node.js 20 and Express.js REST API.
- **Persistence Layer**: MySQL 8.0 relational database with transactional storage.
- **Container Runtime**: Docker Engine and Docker Compose v2.
- **Delivery Pipeline**: GitHub Actions CI/CD, Aqua Trivy, Semgrep, Gitleaks, and GitHub Container Registry (GHCR).
- **Cloud Infrastructure**: Microsoft Azure Ubuntu 24.04 Virtual Machine.

### Recommended Diagnostic Progression:
When an anomaly occurs, isolate the root cause by moving from the user interface down to the underlying infrastructure:

```
[ Application / UI ] ➔ [ Container State ] ➔ [ Docker Compose ] ➔ [ Internal Network ] ➔ [ Database Engine ] ➔ [ CI/CD & Cloud ]
```

> [!NOTE]
> This guide outlines manual diagnostic commands and systematic recovery playbooks for operations and development teams.

---

## 2. Basic Troubleshooting Workflow 🔍

Follow this 10-step diagnostic checklist to quickly triage issues:

```mermaid
flowchart TD
    Step1["1. Check Container Status<br/>docker compose ps"] --> Step2["2. Check Application Logs<br/>docker compose logs -f &lt;service&gt;"]
    Step2 --> Step3["3. Validate Compose Configuration<br/>docker compose config"]
    Step3 --> Step4["4. Test Inter-Container Connectivity<br/>docker compose exec ... wget / curl"]
    Step4 --> Step5["5. Check Environment Variables<br/>Verify .env keys (no secret leaks)"]
    Step5 --> Step6["6. Verify Database Health<br/>Ensure mysql reports (healthy)"]
    Step6 --> Step7["7. Query API Health Probe<br/>curl http://localhost:3000/api/health"]
    Step7 --> Step8["8. Inspect GitHub Actions Run<br/>Review failed CI/CD workflow jobs"]
    Step8 --> Step9["9. Verify GHCR Image Availability<br/>Check image tags on ghcr.io"]
    Step9 --> Step10["10. Recreate Service Selectively<br/>docker compose up -d --force-recreate &lt;service&gt;"]
```

### Initial Triage Commands:
```bash
# 1. View status, uptime, and health indicators for all services
docker compose ps

# 2. View recent logs across all running containers
docker compose logs --tail=100

# 3. Test the live health endpoint through the Nginx gateway
curl -i http://localhost:3000/api/health
```

---

## 3. Frontend & Nginx Issues 🌐

### 1. `502 Bad Gateway` Error from Nginx
- **Symptoms**: The browser displays `502 Bad Gateway` when loading pages or making API calls to `/api/*`.
- **Probable Causes**:
  - The `shopsphere-backend` container is stopped or crashing.
  - The Express server is not listening on internal port `5000`.
  - Docker Compose internal DNS cannot resolve the hostname `backend`.
- **Diagnostic Steps**:
  ```bash
  # Check if backend container is running
  docker compose ps backend

  # View recent backend crash logs
  docker compose logs --tail=50 backend

  # Test connectivity from frontend container to backend
  docker compose exec frontend wget -qO- http://backend:5000/api/health
  ```
- **Remediation**:
  - If the backend crashed, inspect logs for missing environment variables or database connection errors.
  - Restart the backend container: `docker compose restart backend`.

---

### 2. React SPA Routing Returns `404 Not Found` on Page Refresh
- **Symptoms**: Navigating to client routes (e.g., `/orders`, `/cart`, `/admin`) works when clicking links inside the app, but refreshing the browser returns Nginx's default 404 page.
- **Probable Cause**: The Nginx configuration is missing the SPA fallback directive (`try_files $uri $uri/ /index.html;`).
- **Diagnostic Steps**:
  - Inspect `frontend/nginx.conf`:
    ```nginx
    location / {
        try_files $uri $uri/ /index.html;
    }
    ```
- **Remediation**:
  - Ensure `frontend/nginx.conf` includes the fallback directive. Rebuild or pull the updated frontend image.

---

### 3. Port `3000` Host Collision
- **Symptoms**: `docker compose up -d` fails with:
  ```text
  Error response from daemon: driver failed programming external connectivity on endpoint shopsphere-frontend: Bind for 0.0.0.0:3000 failed: port is already allocated
  ```
- **Probable Cause**: Another process or previous container on the host is already bound to port `3000`.
- **Diagnostic Steps**:
  ```bash
  sudo netstat -tulpn | grep 3000
  # or
  sudo ss -tulpn | grep 3000
  ```
- **Remediation**:
  - Terminate the conflicting process, or
  - Modify `FRONTEND_PORT` in your `.env` file (e.g., `FRONTEND_PORT=8080`) and re-run `docker compose up -d`.

---

## 4. Backend API Issues 🟢

### 1. Backend Fails to Start (`[Database Error] Connection failed`)
- **Symptoms**: `docker compose logs backend` displays:
  ```text
  [Database Error] Connection failed: connect ECONNREFUSED 172.20.0.2:3306
  [Warning] Database connection failed. Ensure MySQL server is running and .env database credentials match.
  ```
- **Probable Causes**:
  - The MySQL container has not completed initialization.
  - Database credentials (`DB_USER`, `DB_PASSWORD`, `MYSQL_DATABASE`) in `.env` do not match the database.
- **Diagnostic Steps**:
  ```bash
  # Check MySQL health status (must show "healthy", not "starting")
  docker compose ps mysql

  # Verify backend environment variables inside the container
  docker compose exec backend env | grep -E "DB_|PORT"
  ```
- **Remediation**:
  - Ensure `docker-compose.yml` includes `depends_on: mysql: condition: service_healthy`.
  - Verify that `DB_USER` and `DB_PASSWORD` in `.env` match the credentials initialized in MySQL.

---

### 2. `401 Unauthorized` / Token Rejection
- **Symptoms**: API requests to protected routes (`/api/orders`, `/api/auth/profile`) return:
  ```json
  {
    "success": false,
    "message": "Not authorized, token invalid or expired"
  }
  ```
- **Probable Causes**:
  - The JWT token has expired based on `JWT_EXPIRES_IN`.
  - The client did not provide the `Bearer ` prefix in the `Authorization` header.
  - `JWT_SECRET` changed on the backend while the client held a token signed with the older secret.
- **Remediation**:
  - Re-authenticate via `POST /api/auth/login` to obtain a fresh token.
  - Verify that client headers follow: `Authorization: Bearer <token>`.

---

### 3. `403 Forbidden` on Admin Endpoints
- **Symptoms**: Requests to `/api/admin/*` return:
  ```json
  {
    "success": false,
    "message": "Access denied: Admin privilege required"
  }
  ```
- **Probable Cause**: The authenticated user has `role = 'user'` instead of `role = 'admin'`.
- **Diagnostic Steps**:
  ```sql
  -- Inspect user role in MySQL
  SELECT id, email, role FROM users WHERE email = 'user@example.com';
  ```
- **Remediation**:
  - Ensure you are logged into an administrative account (e.g., `admin@shopsphere.com`).
  - Public registration defaults to `role: 'user'`; admin privileges must be granted directly in the database.

---

### 4. `429 Too Many Requests` (Rate Limiting Triggered)
- **Symptoms**: Requests to `/api/auth/register` or `/api/auth/login` return:
  ```json
  {
    "success": false,
    "message": "Too many authentication attempts. Please try again later."
  }
  ```
- **Probable Cause**: More than 5 authentication attempts were submitted from the same IP address within a 15-minute sliding window.
- **Remediation**:
  - Wait for the 15-minute window (`windowMs: 15 * 60 * 1000`) to expire.
  - Verify that Nginx correctly forwards the client IP (`proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`) so individual clients are not grouped under a single proxy IP.

---

## 5. Database Issues 🗄️

### 1. MySQL Container Unhealthy (`healthcheck failed`)
- **Symptoms**: `docker compose ps` shows `shopsphere-mysql` as `unhealthy` or `restarting`.
- **Probable Causes**:
  - Insufficient host memory or disk space.
  - Syntax error in `./database/schema.sql` during first-time initialization.
  - `MYSQL_ROOT_PASSWORD` changed in `.env` after the database volume was already created.
- **Diagnostic Steps**:
  ```bash
  # Check MySQL error logs
  docker compose logs mysql

  # Check host disk space
  df -h
  ```
- **Remediation**:
  - If `MYSQL_ROOT_PASSWORD` was changed after initial database creation, update `.env` to match the original password, or reset the volume.

---

### 2. Complete Database Reset (Purging and Re-Seeding)
If the database enters an inconsistent or corrupted state during testing:
```bash
# 1. Stop all containers and remove the persistent volume
docker compose down -v

# 2. Restart the stack; MySQL will execute schema.sql fresh
docker compose up -d

# 3. Monitor MySQL health until healthy
docker compose ps mysql
```

> [!WARNING]
> Running `docker compose down -v` permanently removes the `mysql_data` volume and all custom data. Use with caution in production.

---

### 3. Transaction Rollback During Checkout
- **Symptoms**: `POST /api/orders` returns an HTTP `400` with:
  - `"Cannot place order with an empty cart"`
  - `"Insufficient stock for \"<product_name>\". Available: X, requested: Y"`
- **Diagnostic Steps**:
  ```sql
  -- Inspect product stock directly in MySQL
  SELECT id, name, stock FROM products WHERE id = <product_id>;
  ```
- **Behavior**: This is expected transactional protection. The database automatically rolls back all partial inserts if stock is insufficient.

---

### 4. Delivered Order Modification Rejection
- **Symptoms**: Attempting to cancel or update an order returns:
  ```json
  {
    "success": false,
    "message": "Delivered orders cannot be updated."
  }
  ```
- **Behavior**: Intended security safeguard. Orders with status `delivered` are permanently immutable.

---

## 6. Docker & Container Issues 🐳

### 1. Backend Container Exits Immediately (`exit code 1` or `137`)
- **Diagnostic Steps**:
  ```bash
  # Check container exit code
  docker inspect shopsphere-backend --format='{{.State.ExitCode}}'

  # Review container exit logs
  docker compose logs --tail=50 backend
  ```
- **Common Exit Codes**:
  - **`1`**: Application exception or unhandled promise rejection (check logs for syntax or DB connection errors).
  - **`137`**: Out Of Memory (OOM) killer terminated the process. Increase Azure VM RAM or add swap memory.

---

### 2. Inter-Container Network Resolution Failure
- **Symptoms**: Backend or Frontend reports `getaddrinfo ENOTFOUND mysql` or `ENOTFOUND backend`.
- **Diagnostic Steps**:
  ```bash
  # Verify containers are on the same Docker bridge network
  docker network inspect shopsphere-ecommerce_default

  # Test DNS ping between containers
  docker compose exec frontend ping -c 2 backend
  docker compose exec backend ping -c 2 mysql
  ```
- **Remediation**:
  - Restart the Docker daemon if the internal DNS resolver (`127.0.0.11`) stopped responding: `sudo systemctl restart docker`.

---

## 7. GitHub Actions & CI/CD Pipeline Issues 🚀

### 1. Syntax Check Fails (`node --check src/server.js`)
- **Job**: `backend-ci`
- **Cause**: Syntax error or unclosed bracket in backend files.
- **Fix**: Run `node --check src/server.js` locally in `backend/` to pinpoint the file and line number.

---

### 2. Frontend Build Fails (`npm run build`)
- **Job**: `frontend-ci`
- **Cause**: Unresolved JSX import or Vite bundling failure.
- **Fix**: Run `npm run build` locally in `frontend/` to review compilation errors.

---

### 3. Gitleaks Secret Detection Failure
- **Job**: `gitleaks`
- **Cause**: A commit contains a hardcoded password, private key, or API token.
- **Fix**:
  1. Inspect the job log to identify the offending commit hash and filename.
  2. Invalidate and rotate the exposed secret immediately.
  3. Purge the secret from git history using `git-filter-repo` before pushing again.

---

### 4. Semgrep SAST Security Failure
- **Job**: `semgrep`
- **Cause**: Source code violates a security rule in the `p/javascript` ruleset.
- **Fix**: Inspect the Semgrep findings table in GitHub Actions, locate the file path, and refactor the code according to Semgrep's recommendations.

---

### 5. Aqua Trivy Scan Fails with Exit Code `1`
- **Job**: `docker-security`
- **Cause**: An unmitigated `HIGH` or `CRITICAL` CVE was detected in the Docker image layers.
- **Fix**:
  ```bash
  # Run Trivy locally to replicate
  trivy image shopsphere-backend:ci
  ```
  - For OS vulnerabilities: Trigger a base image update (`apk update && apk upgrade` in Dockerfile).
  - For npm package vulnerabilities: Run `npm audit fix` or update the affected library in `package.json`.

---

### 6. GHCR Image Push Fails (`403 Forbidden`)
- **Job**: `docker-security`
- **Causes**:
  - Workflow lacks `packages: write` permissions.
  - The repository owner name contains uppercase characters.
- **Fix**:
  - Ensure `.github/workflows/ci-cd.yml` contains:
    ```yaml
    permissions:
      contents: read
      packages: write
    ```
  - Verify that image names use lowercased owner names:
    ```bash
    IMAGE_OWNER=$(echo "${GITHUB_REPOSITORY_OWNER}" | tr '[:upper:]' '[:lower:]')
    ```

---

## 8. Azure VM & SSH Deployment Issues ☁️

### 1. SSH Action Fails (`dial tcp: i/o timeout` or `handshake failed`)
- **Job Step**: `Deploy to Azure VM`
- **Probable Causes**:
  - `secrets.VM_HOST`, `secrets.VM_USER`, or `secrets.VM_SSH_KEY` are incorrect or missing in GitHub Secrets.
  - The Azure Network Security Group (NSG) blocks port `22`.
- **Diagnostic Steps**:
  - Test connecting manually from your local workstation:
    ```bash
    ssh -i ~/.ssh/id_rsa devopsadmin@<AZURE_VM_HOST>
    ```
- **Remediation**:
  - Ensure the private key in `VM_SSH_KEY` includes both `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`.
  - Add an inbound security rule in the Azure portal for port `22`.

---

### 2. Post-Deployment Health Check Fails After 60 Seconds
- **Symptoms**: The workflow deployment step outputs:
  ```text
  Health check failed. Retrying in 5 seconds...
  ShopSphere health check failed after 60 seconds.
  ```
- **Probable Causes**:
  - The backend container took longer than 60 seconds to boot and connect to MySQL.
  - The backend failed to start due to a database connection error or bad `.env` configuration.
- **Diagnostic Steps**:
  - SSH into the VM and inspect container state:
    ```bash
    cd /home/devopsadmin/shopsphere-ecommerce
    docker compose ps
    docker compose logs --tail=50 backend
    ```
- **Remediation**:
  - Inspect backend logs for initialization errors.
  - Run the health check command manually on the VM to inspect the response:
    ```bash
    curl -v http://localhost:3000/api/health
    ```

---

## 9. Quick Diagnostic Commands Reference 📋

| Purpose | Command |
| :--- | :--- |
| **Check service statuses** | `docker compose ps` |
| **Stream all live logs** | `docker compose logs -f` |
| **Stream backend logs only** | `docker compose logs -f --tail=100 backend` |
| **Stream frontend/Nginx logs** | `docker compose logs -f --tail=100 frontend` |
| **Stream MySQL logs** | `docker compose logs -f --tail=100 mysql` |
| **Query API health endpoint** | `curl -i http://localhost:3000/api/health` |
| **Inspect Nginx HTTP headers** | `curl -I http://localhost:3000` |
| **Open backend shell** | `docker compose exec backend sh` |
| **Open MySQL database shell** | `docker compose exec mysql mysql -u shopsphere_app -p shopsphere` |
| **Inspect internal Docker network** | `docker network inspect shopsphere-ecommerce_default` |
| **Remove dangling images & cache** | `docker image prune -f` |
| **Recreate application services** | `docker compose up -d --force-recreate backend frontend` |

---

## 10. Emergency Recovery Playbook 🧯

### Scenario A: Application Containers Hung (Zero Data Loss)
Restart application services without touching the database:
```bash
docker compose restart backend frontend
curl -fsS http://localhost:3000/api/health
```

---

### Scenario B: Roll Back to a Known Good Release
If the latest deployment introduced an unexpected bug:
```bash
# 1. Edit docker-compose.yml on the Azure VM to reference a prior commit SHA:
# image: ghcr.io/ayan-2023/shopsphere-backend:<KNOWN_GOOD_SHA>
# image: ghcr.io/ayan-2023/shopsphere-frontend:<KNOWN_GOOD_SHA>

# 2. Pull and force recreate
docker compose pull backend frontend
docker compose up -d --force-recreate backend frontend

# 3. Verify health
curl -fsS http://localhost:3000/api/health
```

---

### Scenario C: Complete Clean Stack Reboot
Reboot the full stack preserving volume data:
```bash
docker compose down
docker compose up -d
docker compose ps
```

---

## 11. Troubleshooting Summary

By methodically verifying:

$$\text{docker compose ps} \longrightarrow \text{docker compose logs} \longrightarrow \text{Container Connectivity} \longrightarrow \text{curl /api/health} \longrightarrow \text{CI/CD Audit}$$

operations and development teams can diagnose and resolve runtime, network, database, and pipeline anomalies with minimal downtime.
