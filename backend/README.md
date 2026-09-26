# ShopSphere Backend API

ShopSphere is a robust, modular, and modern RESTful API backend built with **Node.js**, **Express.js**, and **MySQL**. It provides endpoints for user authentication (JWT + bcrypt), product management, category filtering, cart operations, and order placement with relational database transactions.

---

## 📁 Directory Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MySQL database connection pool (mysql2/promise)
│   │
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile
│   │   ├── productController.js  # Product CRUD & search/filter operations
│   │   ├── categoryController.js # Product categories
│   │   ├── cartController.js     # Shopping cart management
│   │   └── orderController.js    # Order checkout & history
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT auth & Admin role verification
│   │   └── errorMiddleware.js    # Centralized 404 & Express error handler
│   │
│   ├── models/
│   │   ├── userModel.js          # User database queries
│   │   ├── productModel.js       # Product database queries
│   │   ├── categoryModel.js      # Category database queries
│   │   ├── cartModel.js         # Cart and Cart Items database queries
│   │   └── orderModel.js         # Orders and Order Items database queries (Transactions)
│   │
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── productRoutes.js      # Product endpoints
│   │   ├── categoryRoutes.js     # Category endpoints
│   │   ├── cartRoutes.js         # Cart endpoints
│   │   └── orderRoutes.js        # Order endpoints
│   │
│   ├── app.js                    # Express application configuration & middleware
│   └── server.js                 # HTTP server entry point & DB test connection
│
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore file
├── package.json                  # Node dependencies & npm scripts
└── README.md                     # Documentation & setup guide
```

---

## 🛠️ Step 1: Create the MySQL Database

Open your MySQL Terminal, MySQL Workbench, or phpMyAdmin, and run the following SQL statement to create the database:

```sql
CREATE DATABASE IF NOT EXISTS shopsphere DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 📥 Step 2: Import `../database/schema.sql`

You can import the schema and seed data into MySQL using any of the following methods:

### Option A: Using MySQL Command Line (Recommended)
```bash
mysql -u root -p shopsphere < ../database/schema.sql
```

### Option B: Using MySQL Workbench or phpMyAdmin
1. Open **MySQL Workbench** or **phpMyAdmin**.
2. Select the `shopsphere` database.
3. Open `../database/schema.sql` and execute the entire script.

---

## ⚙️ Step 3: Configure `.env` File

Copy `.env.example` to `.env` in the root of the project:

```bash
cp .env.example .env
```

Open `.env` and fill in your local MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=shopsphere
JWT_SECRET=super_secret_jwt_key_shopsphere_2026
JWT_EXPIRES_IN=7d
```

---

## 🚀 Step 4: Start the Backend Server

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server** (with automatic restart via `nodemon`):
   ```bash
   npm run dev
   ```

3. **Start Production Server**:
   ```bash
   npm start
   ```

When the server starts successfully, you will see:
```text
==================================================
🚀 ShopSphere Backend Server active on port 5000
🌐 Base API URL: http://localhost:5000/api
❤️  Health check: http://localhost:5000/api/health
==================================================
[Database] Connected successfully to MySQL database: "shopsphere"
```

---

## 🧪 Step 5: Test API Endpoints using `curl`

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```
**Response:**
```json
{
  "success": true,
  "message": "ShopSphere API is running"
}
```

---

### 2. Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123"
  }'
```

---

### 3. User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```
*Tip: Copy the returned `token` from the response to use in protected endpoints.*

---

### 4. Get All Products
```bash
curl http://localhost:5000/api/products
```

To filter by category or search term:
```bash
curl "http://localhost:5000/api/products?category=Electronics"
curl "http://localhost:5000/api/products?search=Headphones"
```

---

### 5. Get Product by ID
```bash
curl http://localhost:5000/api/products/1
```

---

### 6. Additional Key Endpoints

- **Get Categories**: `GET http://localhost:5000/api/categories`
- **Get User Profile**: `GET http://localhost:5000/api/auth/profile` *(Requires `Authorization: Bearer <token>`)*
- **Get User Cart**: `GET http://localhost:5000/api/cart` *(Requires `Authorization: Bearer <token>`)*
- **Add to Cart**: `POST http://localhost:5000/api/cart` *(Requires `Authorization: Bearer <token>`)*
  ```json
  { "productId": 1, "quantity": 2 }
  ```
- **Place Order**: `POST http://localhost:5000/api/orders` *(Requires `Authorization: Bearer <token>`)*
  ```json
  { "shippingAddress": "123 Tech Lane, Silicon Valley, CA" }
  ```
- **Admin Create Product**: `POST http://localhost:5000/api/products` *(Requires Admin `Authorization: Bearer <admin_token>`)*

---

## 🔒 Pre-configured Test Accounts

The seed script (`../database/schema.sql`) automatically creates 2 test accounts (Password for both: `password123`):

1. **Admin Account**: `admin@shopsphere.com`
2. **Standard User Account**: `john@example.com`
