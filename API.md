# 🔐 Authentication API – Posecom

Welcome to the **Posecom Authentication API**, built with Express.js and MongoDB using modern JavaScript (ESM). This API handles secure user authentication with JWT, including registration, login, profile retrieval, and profile updates.

---

## 📁 Base URL

```
/api/auth
```

---

## 🚀 Features

- ✅ User Registration
- ✅ User Login
- ✅ Get Profile (Authenticated)
- ✅ Update Profile (Authenticated)
- 🔐 JWT Token-based Authentication
- 🔒 Password hashing with bcrypt

---

## 📌 Routes & Examples

### 📨 1. Register User

- **Endpoint**: `POST /api/auth/register`
- **Description**: Register a new user.

#### ✅ Request Body:

```json
{
  "name": "Boss",
  "email": "boss@example.com",
  "password": "12345678"
}
```

#### ✅ Success Response:

```json
{
  "_id": "user_id",
  "name": "Boss",
  "email": "boss@example.com",
  "role": "user",
  "token": "JWT_TOKEN"
}
```

---

### 🔑 2. Login User

- **Endpoint**: `POST /api/auth/login`
- **Description**: Login with credentials.

#### ✅ Request Body:

```json
{
  "email": "boss@example.com",
  "password": "12345678"
}
```

#### ✅ Success Response:

```json
{
  "_id": "user_id",
  "name": "Boss",
  "email": "boss@example.com",
  "role": "user",
  "token": "JWT_TOKEN"
}
```

---

### 🧾 3. Get User Profile

- **Endpoint**: `GET /api/auth/profile`
- **Description**: Get currently logged-in user's profile.
- **Headers**:  
  `Authorization: Bearer JWT_TOKEN`

#### ✅ Success Response:

```json
{
  "_id": "user_id",
  "name": "Boss",
  "email": "boss@example.com",
  "role": "user"
}
```

---

### 🛠️ 4. Update User Profile

- **Endpoint**: `PUT /api/auth/profile`
- **Description**: Update logged-in user's profile.
- **Headers**:  
  `Authorization: Bearer JWT_TOKEN`

#### ✅ Request Body (any field optional):

```json
{
  "name": "Boss Updated",
  "email": "boss@posecom.com",
  "password": "newsecurepassword"
}
```

#### ✅ Success Response:

```json
{
  "_id": "user_id",
  "name": "Boss Updated",
  "email": "boss@posecom.com",
  "role": "user",
  "token": "NEW_JWT_TOKEN"
}
```

### 📘 Product API Guide for Testing

## Get All Products

## URL: GET /api/products

Description: Get all products with optional filtering.

Query Parameters (optional):

discount — if present, filters products with discount > 0

category — filter by category (string)

search — search by product name (case-insensitive)

Example Request:

http

```
GET /api/products?discount=true&category=Electronics&search=sample
```

Response:

json

```
[
{
"\_id": "6849cc59ffaf4ea8aee1dac1",
"name": "Sample Product",
"description": "This is a test product",
"price": 100,
"discount": 0,
"images": ["http://example.com/image.png"],
"category": "Electronics",
"stock": 50,
"createdAt": "2025-06-11T18:35:05.367Z",
"updatedAt": "2025-06-11T18:35:05.367Z"
}
]
```

## Get Product by ID

# URL: GET /api/products/:id

Description: Get product details by product ID.

Example Request:

http

```
GET /api/products/6849cc59ffaf4ea8aee1dac1
```

Response:

json

```

{
"\_id": "6849cc59ffaf4ea8aee1dac1",
"name": "Sample Product",
"description": "This is a test product",
"price": 100,
"discount": 0,
"images": ["http://example.com/image.png"],
"category": "Electronics",
"stock": 50,
"createdAt": "2025-06-11T18:35:05.367Z",
"updatedAt": "2025-06-11T18:35:05.367Z"
}
```

## Create Product (Admin only)

```
URL: POST /api/products
```

Headers:
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

Body:

json

```


{
"name": "Sample Product",
"description": "This is a test product",
"price": 100,
"discount": 0,
"images": ["http://example.com/image.png"],
"category": "Electronics",
"stock": 50
}
```

Response:

json

```

Copy
{
"\_id": "6849cc59ffaf4ea8aee1dac1",
"name": "Sample Product",
"description": "This is a test product",
"price": 100,
"discount": 0,
"images": ["http://example.com/image.png"],
"category": "Electronics",
"stock": 50,
"createdAt": "2025-06-11T18:35:05.367Z",
"updatedAt": "2025-06-11T18:35:05.367Z"
}

```

## Update Product (Admin only)

```
URL: PUT /api/products/:id
```

Headers:
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

Body: (Any subset of product fields to update)

json

```
{
"price": 120,
"stock": 60
}
```

Response:

```


{
"\_id": "6849cc59ffaf4ea8aee1dac1",
"name": "Sample Product",
"description": "This is a test product",
"price": 120,
"discount": 0,
"images": ["http://example.com/image.png"],
"category": "Electronics",
"stock": 60,
"createdAt": "2025-06-11T18:35:05.367Z",
"updatedAt": "2025-06-12T10:00:00.000Z"
}
```

## Delete Product (Admin only)

```
URL: DELETE /api/products/:id
```

Headers:
Authorization: Bearer <admin-jwt-token>

Response:

json

```
{
"message": "Product deleted"
}
```

---

## 🔒 Error Handling

| Code | Message                      |
| ---- | ---------------------------- |
| 400  | Email already in use         |
| 401  | Invalid credentials          |
| 401  | Not authorized, no token     |
| 401  | Not authorized, token failed |
| 404  | User not found               |
| 500  | Server error                 |

---

## 🧪 Testing

Use **Thunder Client**, **Postman**, or **curl** to test endpoints.  
Ensure to set the `Authorization` header for protected routes.

---

## ⚙️ Setup Instructions

```bash
# Install dependencies
npm install

# Set environment variables in .env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret

# Run the server
npm run dev
```

---

## 👨‍💻 Tech Stack

- Node.js (ESM)
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs

---

## 📂 Folder Structure

```
src/
├── controllers/
│   └── authController.js
├── models/
│   └── User.js
├── routes/
│   └── auth.js
├── middleware/
│   └── authMiddleware.js
├── app.js
└── server.js
```

---

## 🧠 Author

**Bikash Adhikari** – [@adhikaribikash582](mailto:adhikaribikash582@gmail.com)  
Part of the **Posecom** Project

---

## 📜 License

This project is licensed under the MIT License – feel free to use and modify.
