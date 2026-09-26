# 🛡️ ShopSphere — Security Documentation

This document describes the security architecture, implemented controls, vulnerability defense mechanisms, and DevSecOps practices of **ShopSphere**.

---

## 1. Security Overview

ShopSphere employs a multi-tiered security strategy separating **Application-Level Security** from **Infrastructure & Container Security**:

```
+----------------------------------------------------------------------------------------------------+
|                                    APPLICATION SECURITY LAYER                                      |
| • JWT Bearer Token Authorization          • bcryptjs Password Hashing (10 rounds)                  |
| • Role-Based Access Control (Admin/User)  • Auth Rate Limiting (5 attempts / 15 mins)              |
| • Strict Input & Email Format Validation  • Parameterized SQL Queries (mysql2/promise)             |
| • Transactional Inventory Isolation       • Verified Review & Delivered-Order Protections          |
+----------------------------------------------------------------------------------------------------+
                                                  │
                                                  ▼
+----------------------------------------------------------------------------------------------------+
|                               CONTAINER & INFRASTRUCTURE SECURITY                                  |
| • Multi-Stage Hardened Docker Builds      • Non-Root Container Execution (USER node)               |
| • Production-Only Dependency Packaging    • Runtime Package Manager Removal (npm stripped)         |
| • Private Internal Docker Networking      • Database & Backend Ports Not Published to Host         |
+----------------------------------------------------------------------------------------------------+
                                                  │
                                                  ▼
+----------------------------------------------------------------------------------------------------+
|                                    DEVSECOPS PIPELINE GATES                                        |
| • Gitleaks Commit Secret Detection        • Semgrep Static Application Security Testing (SAST)     |
| • Aqua Trivy Container Vulnerability Scan • Automated Quality & Health Gates Before Rollout        |
+----------------------------------------------------------------------------------------------------+
```

---

## 2. Authentication 🔐

Authentication is handled via dedicated endpoints in [backend/src/controllers/authController.js](file:///e:/DevOps%20Coding/shopsphere-ecommerce/backend/src/controllers/authController.js) and [backend/src/routes/authRoutes.js](file:///e:/DevOps%20Coding/shopsphere-ecommerce/backend/src/routes/authRoutes.js).

### Registration (`POST /api/auth/register`)
- **Required Fields**: Validates that `name`, `email`, and `password` are present in the request body. If any are missing, returns an HTTP `400 Bad Request`.
- **Email Normalization & Sanitization**: Trims whitespace and normalizes email strings to lowercase (`email?.trim().toLowerCase()`).
- **Email Format Validation**: Evaluates emails against a strict regular expression:
  ```javascript
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  ```
- **Password Length Enforcement**: Requires passwords to be at least 8 characters long (`password.length < 8` returns HTTP `400`).
- **Duplicate Account Protection**: Checks existing user records via `userModel.findByEmail(normalizedEmail)`. If an account already exists, returns an HTTP `400` with `'Email already registered'`.
- **Cryptographic Hashing**: Salts and hashes passwords before writing to the database using `bcryptjs`.
- **Role Elevation Defense**: The registration controller explicitly hardcodes `role: 'user'` during creation:
  ```javascript
  const newUser = await userModel.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: 'user',
  });
  ```
  *Public registration cannot self-assign or inject the `admin` role.*
- **Automatic Cart Association**: Automatically initializes an empty cart record via `cartModel.getOrCreateCart(newUser.id)`.
- **Credential Masking**: The response omits password hashes, returning only public profile fields:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "token": "<JWT_TOKEN>",
      "user": {
        "id": 1,
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "user"
      }
    }
  }
  ```

### Login (`POST /api/auth/login`)
- **Input Validation**: Verifies that both `email` and `password` are provided in the payload.
- **Account Lookup**: Queries the user record by email.
- **Password Comparison**: Uses `bcrypt.compare(password, user.password)` to verify credentials against the stored hash.
- **User Enumeration Defense**: If the user does not exist or the password comparison fails, the controller returns an identical generic error message (`'Invalid email or password'`) with HTTP `401 Unauthorized`.
- **JWT Issuance**: Upon successful verification, generates and returns a signed JSON Web Token.

---

## 3. Password Security 🔑

- **Algorithm**: Passwords are encrypted using **`bcryptjs`** with a salt round factor of `10`:
  ```javascript
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  ```
- **No Plaintext Persistence**: Plaintext passwords are never logged, stored in temporary files, or inserted into the database.
- **Minimum Length Validation**: Passwords must contain a minimum of 8 characters.
- **Hash Sanitization in Middleware**: The authentication middleware (`protect`) explicitly strips the password hash when populating `req.user`:
  ```javascript
  const { password, ...userWithoutPassword } = user;
  req.user = userWithoutPassword;
  ```
  This guarantees that subsequent controllers and logging utilities cannot inadvertently access or expose password hashes.

---

## 4. JWT Authentication 🎫

ShopSphere uses stateless JSON Web Tokens for API session management.

### Token Generation:
```javascript
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};
```
- **Token Claims**: Contains the user ID (`{ id }`), signed using `JWT_SECRET`.
- **Configurable Lifespan**: Expiration is controlled via the `JWT_EXPIRES_IN` environment variable (defaulting to 7 days).

### Request Authorization Header:
Clients authenticate protected requests by transmitting the token in the standard HTTP `Authorization` header:
```text
Authorization: Bearer <JWT_TOKEN>
```

### Verification Middleware (`protect`):
Located in [backend/src/middleware/authMiddleware.js](file:///e:/DevOps%20Coding/shopsphere-ecommerce/backend/src/middleware/authMiddleware.js):
1. Verifies the presence of the `Bearer` token prefix in `req.headers.authorization`.
2. Validates token signature and expiration via `jwt.verify(token, process.env.JWT_SECRET)`.
3. Verifies that the user still exists in MySQL (`userModel.findById(decoded.id)`).
4. Returns an HTTP `401 Unauthorized` if the token is missing, expired, altered, or references a deleted user.

---

## 5. Role-Based Access Control (RBAC) 👥

User privileges are governed by roles stored in the `users.role` enum column (`'user'`, `'admin'`).

### Enforcement Mechanism (`adminOnly` Middleware):
```javascript
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied: Admin privilege required',
  });
};
```

### Protected Administrative Endpoints:
The following route groups enforce sequential validation through `protect` followed by `adminOnly`:
- **Administrative Metrics**: `GET /api/admin/dashboard/stats`
- **Global Order Inspection**: `GET /api/admin/orders`
- **Order Status Modification**: `PUT /api/admin/orders/:id/status`
- **Product Catalog Management**: `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`

Attempts by standard users (`role = 'user'`) to access administrative endpoints are blocked with an HTTP `403 Forbidden` response.

---

## 6. Rate Limiting & Abuse Prevention ⏱️

To mitigate brute-force password guessing, dictionary attacks, and denial-of-service attempts on authentication routes, ShopSphere configures `express-rate-limit`:

```javascript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute sliding window
  limit: 5,                  // Maximum 5 attempts per window per IP
  standardHeaders: true,     // Returns standard RateLimit headers (draft-6 / draft-7)
  legacyHeaders: false,      // Disables X-RateLimit-* legacy headers
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
});
```

### Rate-Limited Routes:
The limiter is mounted directly on sensitive public authentication routes in [backend/src/routes/authRoutes.js](file:///e:/DevOps%20Coding/shopsphere-ecommerce/backend/src/routes/authRoutes.js):
- `POST /api/auth/register`
- `POST /api/auth/login`

Requests exceeding the threshold receive an HTTP `429 Too Many Requests` response.

---

## 7. Input Validation & Business Logic Controls 🛡️

ShopSphere enforces business logic boundaries at both controller and model layers:

### 1. Atomic Order Checkout & Stock Protection
- **Transaction Isolation**: Order creation executes inside a database transaction (`connection.beginTransaction()`).
- **Pre-Order Stock Validation**: Evaluates `item.stock < item.quantity` for every item in the cart. If any product is understocked, rolls back the transaction and rejects the order.
- **Atomic Stock Decrement**: Reduces `products.stock` in the same transaction that generates `orders` and `order_items`.

### 2. Order Cancellation & Stock Restoration
- **Restoration**: Transitioning an order to `cancelled` queries `order_items` and adds the quantities back to `products.stock`.
- **Duplicate Prevention**: If an order is already marked `cancelled`, repeated cancellation calls return without double-restoring stock.
- **Delivered Order Immutability**: Orders marked `delivered` are permanent. Any attempt to update their status throws an error (`'Delivered orders cannot be updated.'`), preventing tampering with completed shipments.

### 3. Review Submission Integrity
- **Verified Purchase Requirement**: [backend/src/models/reviewModel.js](file:///e:/DevOps%20Coding/shopsphere-ecommerce/backend/src/models/reviewModel.js) checks that the reviewing user actually purchased the product AND that the order status is `'delivered'`:
  ```sql
  SELECT o.id, o.status, oi.product_id
  FROM orders o
  INNER JOIN order_items oi ON o.id = oi.order_id
  WHERE o.id = ? AND o.user_id = ? AND oi.product_id = ? AND o.status = 'delivered'
  ```
- **Duplicate Review Prevention**: Rejects reviews if a review already exists for the tuple `(user_id, product_id, order_id)`.
- **Rating Range Validation**: Constrains ratings to integer values between 1 and 5.
- **Text Length Limit**: Review text is limited to 1,000 characters.
- **Ownership Check on Deletion**: Users can only delete their own reviews (`DELETE FROM reviews WHERE id = ? AND user_id = ?`).

### 4. Wishlist Duplicate Prevention
- Checks `SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?` to block duplicate bookmarks.

---

## 8. Database Security & Injection Mitigation 🗄️

### Parameterized Prepared Statements:
All database interactions in [backend/src/models/](file:///e:/DevOps%20Coding/shopsphere-ecommerce/backend/src/models/) use parameterized SQL statements through the `mysql2/promise` library:
```javascript
// Parameterized query prevents SQL injection
const [rows] = await pool.execute(
  'SELECT id, password, role FROM users WHERE email = ?',
  [email]
);
```
No dynamic SQL queries are constructed using string concatenation with untrusted user input.

### Relational Schema Constraints:
The database schema [database/schema.sql](file:///e:/DevOps%20Coding/shopsphere-ecommerce/database/schema.sql) enforces integrity:
- `users`: `UNIQUE KEY (email)`
- `cart`: `UNIQUE KEY (user_id)`
- `cart_items`: `UNIQUE KEY unique_cart_product (cart_id, product_id)`
- `wishlist`: `UNIQUE KEY unique_user_product (user_id, product_id)`
- `reviews`: `UNIQUE KEY unique_user_product_order (user_id, product_id, order_id)`
- `reviews`: `CONSTRAINT chk_reviews_rating CHECK (rating >= 1 AND rating <= 5)`
- Referential cascades (`ON DELETE CASCADE` on cart/order items, `ON DELETE SET NULL` on categories).

### Network Isolation:
The MySQL container (`shopsphere-mysql`) does not bind to any host network interfaces. Port `3306` is accessible exclusively to other containers on the internal Docker Compose bridge network.

---

## 9. Container Security & Hardening 🐳

### 1. Multi-Stage Docker Builds
The backend Dockerfile ([backend/Dockerfile](file:///e:/DevOps%20Coding/shopsphere-ecommerce/backend/Dockerfile)) splits build and runtime stages:
- **Stage 1 (`dependencies`)**: Runs `npm ci --omit=dev` to isolate production dependencies.
- **Stage 2 (`runtime`)**: Copies only the pre-built `node_modules` into a clean Alpine image.

### 2. Runtime Attack Surface Reduction
- **Package Manager Stripped**: The runtime container executes:
  ```dockerfile
  RUN rm -rf /usr/local/lib/node_modules/npm
  ```
  Removing `npm` binaries denies attackers the ability to download or execute third-party attack packages if remote code execution were attempted.
- **System Package Updates**: Runs `apk update && apk upgrade` to patch known operating system vulnerabilities.

### 3. Non-Root Container Execution
The backend process runs under the unprivileged `node` user (UID 1000) rather than `root`:
```dockerfile
USER node
```
This restricts container breakout opportunities and limits access to container filesystem paths.

### 4. Minimal Port Exposure
Only the Nginx frontend container exposes an external port (`3000:80`). The backend API (port `5000`) and MySQL (port `3306`) are reachable only via internal container hostnames.

---

## 10. Secrets & Environment Handling 🔒

### Separation of Code and Secrets:
- All sensitive parameters (`MYSQL_ROOT_PASSWORD`, `DB_PASSWORD`, `JWT_SECRET`, `VM_SSH_KEY`) are stored outside source code.
- `.gitignore` explicitly excludes local environment files:
  ```gitignore
  .env
  .env.*
  !.env.example
  ```
- Public templates ([.env.example](file:///e:/DevOps%20Coding/shopsphere-ecommerce/.env.example)) contain only non-confidential placeholder names.

### CI/CD Deployment Secrets:
The GitHub Actions workflow retrieves deployment credentials directly from encrypted GitHub Repository Secrets:
- `secrets.VM_HOST`
- `secrets.VM_USER`
- `secrets.VM_SSH_KEY`
- `secrets.GITHUB_TOKEN`

---

## 11. DevSecOps Scanning in CI/CD 🚀

Every push and pull request to `main` undergoes automated security audits in [.github/workflows/ci-cd.yml](file:///e:/DevOps%20Coding/shopsphere-ecommerce/.github/workflows/ci-cd.yml):

### 1. Secret Scanning (Gitleaks)
- Scans full commit history (`fetch-depth: 0`) using `gitleaks/gitleaks-action@v3`.
- Blocks commits containing private keys, access tokens, or hardcoded passwords.

### 2. Static Application Security Testing (Semgrep SAST)
- Evaluates JavaScript source code using `semgrep/semgrep-action@v1`.
- Enforces the `p/javascript` ruleset to detect security anti-patterns (such as insecure regex, prototype pollution, and unsafe evaluations).

### 3. Container Vulnerability Scanning (Aqua Trivy)
- Audits local CI container images for OS and package vulnerabilities:
  ```yaml
  - name: Scan backend image with Trivy
    uses: aquasecurity/trivy-action@master
    with:
      image-ref: shopsphere-backend:ci
      format: table
      exit-code: '1'
      ignore-unfixed: true
      severity: CRITICAL,HIGH
  ```
- Any unpatched `HIGH` or `CRITICAL` CVE causes the pipeline to exit with code `1`, preventing deployment of vulnerable images.

---

## 12. Current Security Boundaries & Future Enhancements ⚖️

To maintain clear architectural transparency, the following table distinguishes current implementations from prospective improvements:

| Security Domain | Currently Implemented | Future Enhancement |
| :--- | :--- | :--- |
| **Transport Layer Security** | Plain HTTP on host port `3000` | HTTPS/TLS termination via Let's Encrypt / Certbot or Azure Application Gateway |
| **Cross-Origin Resource Sharing (CORS)** | Permissive `origin: '*'` in `backend/src/app.js` | Restrict `origin` to production domain FQDN |
| **Secret Storage** | Server-side `.env` on host filesystem | Centralized cloud secrets via Azure Key Vault |
| **Edge Protection** | Application-level rate limiting (5 req / 15 min) | Cloud Web Application Firewall (Azure WAF) & DDoS protection |
| **Container Integrity** | Multi-stage build + Trivy vulnerability gating | Cryptographic container image signing via Cosign |
| **Database Encryption** | Volume persistence on VM host disk | Transparent Data Encryption (TDE) & automated offsite encrypted backups |

---

## 13. Security Summary

ShopSphere integrates defensive coding practices with automated supply-chain verification:

$$\text{Secret Scan (Gitleaks)} + \text{SAST (Semgrep)} + \text{CVE Gate (Trivy)} + \text{Non-Root Runtime} + \text{Rate Limiting} + \text{bcrypt / JWT} + \text{ACID RBAC}$$

This multi-layer architecture ensures that code, containers, and data flows adhere to shift-left DevSecOps standards and modern application security best practices.
