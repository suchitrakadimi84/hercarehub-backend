# HerCare Hub — Backend API

A robust RESTful API powering the **HerCare Hub** e-commerce platform — a women-focused online store offering fashion, beauty, wellness, and lifestyle products.

---

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **Media Storage:** Cloudinary
- **Process Manager:** PM2 (via `ecosystem.config.js`)

---

## 📁 Project Structure

```
backend/
├── middleware/         # Auth & error handling middleware
├── models/            # Mongoose data models (User, Product, Order...)
├── routes/            # Express route handlers
├── utils/             # Utility scripts (e.g. seed data)
├── server.js          # Entry point
├── ecosystem.config.js # PM2 config for production
├── package.json
└── .env               # Environment variables (NOT committed — see below)
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/suchitrakadimi84/hercarehub-backend.git
cd hercarehub-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/hercareHub
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_strong_password
NODE_ENV=development
```

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore`.

### 4. Run the development server

```bash
npm start
```

The API will be available at `http://localhost:5000`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |
| GET | `/api/orders` | Get user's orders |
| POST | `/api/orders` | Place an order |

---

## 🔐 Authentication

This API uses **JWT Bearer Token** authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

---

## 🌐 Deployment

This backend is deployed on **Render**. The `ecosystem.config.js` file is configured for PM2 process management.

### Production Environment Variables
Set all variables from the `.env` section above in your hosting dashboard (Render → Environment tab).

---

## 📄 License

This project is private and intended for personal/commercial use by HerCare Hub.
