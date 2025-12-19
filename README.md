# POS & Payment API Documentation 💳

A comprehensive Point of Sale (POS) system API that handles orders, customers, and payments with support for credit tracking, partial payments, and stock validation.

## Features

- **Credit Tracking**: Track customer credit balances automatically
- **Flexible Payments**: Support for cash, credit, partial, and full payments
- **Stock Management**: Validate product availability for stock-tracked items
- **Customer Management**: Maintain customer records and order history
- **JWT Authentication**: Secure API endpoints with token-based authentication

---

## Authentication 🔐

All protected routes require a JSON Web Token (JWT) in the Authorization header:

```
Authorization: Bearer <token>
```

---

## API Endpoints|

### Register

to create a user default role will be user
**ENdpoint**: `POST /api/auth/register`
**Request Body**:

```json
{
  "name": "admin",
  "email": "admin@example.com",
  "password": "yourpassword"
}
```

**Response **:

```json
{
  "_id": "69252c7952bd71fa5d9333c5",
  "name": "admin",
  "email": "admin@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjUyYzc5NTJiZDcxZmE1ZDkzMzNjNSIsImlhdCI6MTc2NDA0Mzg5OCwiZXhwIjoxNzY0NjQ4Njk4fQ.-LdeMI4fXofaf4QJUCIR5_ER5u_EVqWQMJfLExlF1tk"
}
```

---

### 1. Login

Authenticate a user and receive a JWT token.

**Endpoint**: `POST /api/auth/login`

**Request Body**:

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response**:

```json
{
  "token": "<jwt_token>",
  "user": {
    "_id": "userId",
    "name": "Admin",
    "role": "admin"
  }
}
```

---

### 1. Create New Products

we have two type of product one req stock and one without
where we can define it

products with stcok required will have automatic stock management enabled

**Endpoint**: ` /api/products`
**Method** :Post

```json
{
  "name": "Test",
  "price": 100,
  "stock": 10,
  "category": "Snacks",
  "requiresStock": true,
  "lowStockThreshold": 2,
  "images": []
}
```

\*\* Response

```json
{
  "name": "Test",
  "price": 100,
  "stock": 10,
  "category": "Snacks",
  "requiresStock": true,
  "lowStockThreshold": 2,
  "images": []
}
```

**Endpoint**: `GET /api/products`
**Method** :Post

product with no stock

```json
{
  "name": "Digital Recharge",
  "price": 50,
  "stock": 0,
  "category": "Services",
  "requiresStock": false,
  "lowStockThreshold": 0,
  "images": []
}
```

\*\* Response

```json
{
  "name": "Digital Recharge",
  "price": 50,
  "discount": 0,
  "images": [],
  "category": "Services",
  "stock": 0,
  "requiresStock": false,
  "lowStockThreshold": 0,
  "_id": "6925362f52bd71fa5d9333d6",
  "createdAt": "2025-11-25T04:53:03.321Z",
  "updatedAt": "2025-11-25T04:53:03.321Z",
  "__v": 0
}
```

### 2. Get All Products

Retrieve a list of all available products.

**Endpoint**: `GET /api/products`

**Response**:

```json
[
  {
    "_id": "691fc794ea0e6af4cdf0602c",
    "name": "americano",
    "price": 130,
    "stock": 0,
    "requiresStock": false
  },
  {
    "_id": "691fc86cea0e6af4cdf06044",
    "name": "Surya",
    "price": 25,
    "stock": 1000,
    "requiresStock": true
  }
]
```

---

# 🍽️ Create Waiter Order API

Create a new order placed by a waiter.

**Endpoint:** `POST /api/orders/waiter`

---

## 📥 Request Body

```json
{
  "tableNo": "Table 1",
  "remarks": "Extra cheese",
  "items": [
    {
      "product": "6925323852bd71fa5d9333d3",
      "quantity": 1
    }
  ]
}
```

### Parameters

| Parameter          | Type   | Description                            |
| ------------------ | ------ | -------------------------------------- |
| `tableNo`          | string | Table number where the order is placed |
| `remarks`          | string | Optional notes for the kitchen         |
| `items`            | array  | List of products being ordered         |
| `items[].product`  | string | Product ID                             |
| `items[].quantity` | number | Quantity ordered                       |

---

## 📤 Response

```json
{
  "message": "Order placed",
  "order": {
    "tableNo": "Table 1",
    "customer": null,
    "customerName": null,
    "items": [
      {
        "product": "6925323852bd71fa5d9333d3",
        "quantity": 1,
        "_id": "692549db52bd71fa5d933405"
      }
    ],
    "total": 100,
    "remarks": "Extra cheese",
    "source": "waiter-app",
    "amountPaid": 0,
    "paymentMethod": "unpaid",
    "paymentStatus": "pending",
    "user": "69252fe252bd71fa5d9333ca",
    "placedBy": "admin",
    "_id": "692549db52bd71fa5d933404",
    "createdAt": "2025-11-25T06:16:59.264Z",
    "__v": 0
  }
}
```

---

## 📝 Description

This endpoint allows a waiter (or admin) to place an order for any table.

- **No customer record is created**
- **Stock is automatically deducted** based on product requirements
- **Total is auto-computed** from product prices
- **Order remains unpaid** until checkout
- The account placing the order is stored in `user` and `placedBy`
- Source is always `"waiter-app"`

---

## ✅ Success Response

**Status Code:** `200 OK`

The response includes a confirmation message and the complete order object with all auto-generated fields.

### 3. Create POS Order

Create a new point of sale order. **Admin only**.

custumer name here will create a new custumer if not alredy
and add order balance

**Endpoint**: `POST /api/orders/pos`

**Request Body**:

```json
{
  "customerName": "Ram Bahadur",
  "customerPhone": "9800000000",
  "items": [
    {
      "product": "691fc794ea0e6af4cdf0602c",
      "quantity": 2,
      "remarks": "No sugar"
    },
    {
      "product": "691fc86cea0e6af4cdf06044",
      "quantity": 3,
      "remarks": "Pack carefully"
    }
  ],
  "total": 335,
  "paymentMethod": "cash"
}
```

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| customerName | string | Name of the customer |
| customerPhone | string | Phone number of the customer |
| items | array | List of products in the order |
| total | number | Total cost of the order |
| paymentMethod | string | Initial payment method (cash or credit) |

**Response**:

```json
{
  "message": "POS order created",
  "order": {
    "_id": "6923012234f1f089a8bbc18c",
    "customer": "6923012134f1f089a8bbc18a",
    "customerName": "Ram Bahadur",
    "items": [
      {
        "product": "691fc794ea0e6af4cdf0602c",
        "quantity": 2,
        "remarks": "No sugar"
      },
      {
        "product": "691fc86cea0e6af4cdf06044",
        "quantity": 3,
        "remarks": "Pack carefully"
      }
    ],
    "total": 335,
    "source": "pos",
    "amountPaid": 0,
    "paymentMethod": "cash",
    "paymentStatus": "pending",
    "createdAt": "2025-11-23T12:42:10.032Z"
  }
}
```

---

### 4. Get All Customers

Retrieve a list of all customers.

**Endpoint**: `GET /api/customers`

**Response**:

```json
{
  "message": "Customers fetched",
  "customers": [
    {
      "_id": "6923012134f1f089a8bbc18a",
      "name": "Ram Bahadur",
      "phone": "9800000000",
      "creditBalance": 335
    }
  ]
}
```

---

### 5. Get Customer By ID

Retrieve detailed information about a specific customer, including their order history.

**Endpoint**: `GET /api/customers/:id`

**Response**:

```json
{
  "customer": {
    "_id": "6923012134f1f089a8bbc18a",
    "name": "Ram Bahadur",
    "phone": "9800000000",
    "creditBalance": 335
  },
  "orders": [
    {
      "_id": "6923012234f1f089a8bbc18c",
      "items": [
        {
          "product": {
            "_id": "691fc794ea0e6af4cdf0602c",
            "name": "americano",
            "price": 130
          },
          "quantity": 2
        },
        {
          "product": {
            "_id": "691fc86cea0e6af4cdf06044",
            "name": "Surya",
            "price": 25
          },
          "quantity": 3
        }
      ],
      "total": 335,
      "amountPaid": 0,
      "paymentMethod": "cash",
      "paymentStatus": "pending"
    }
  ]
}
```

---

### 6. Update Payment / Add Credit

Update payment information for an order, supporting both credit and cash payments.

**Endpoint**: `POST /api/payments/order/:id`

**Path Parameter**:
| Parameter | Type | Description |
|-----------|------|-------------|
| :id | string | The ID of the order to update payment for |

**Request Body (Full Credit)**:

Marks the entire order as payable via credit, increasing the customer's credit balance.

```json
{
  "paymentMethod": "credit"
}
```

**Request Body (Partial or Full Cash Payment)**:

Applies a cash payment amount to the order.

```json
{
  "paymentMethod": "cash",
  "amountPaid": 200
}
```

**Response (Credit Payment)**:

```json
{
  "message": "Order added to credit",
  "order": {
    "_id": "6923012234f1f089a8bbc18c",
    "amountPaid": 0,
    "paymentMethod": "credit",
    "paymentStatus": "pending"
  }
}
```

**Response (Partial Cash Payment)**:

```json
{
  "message": "Payment updated",
  "order": {
    "_id": "6923012234f1f089a8bbc18c",
    "amountPaid": 200,
    "paymentMethod": "cash",
    "paymentStatus": "partial"
  }
}
```

---

### 7. Get Payment History for an Order

Retrieve the complete payment history for a specific order.

**Endpoint**: `GET /api/payments/order/:orderId`

**Path Parameter**:
| Parameter | Type | Description |
|-----------|------|-------------|
| :orderId | string | The ID of the order |

**Response**:

```json
[
  {
    "_id": "6923023734f1f089a8bbc194",
    "order": "6923012234f1f089a8bbc18c",
    "customer": "6923012134f1f089a8bbc18a",
    "amount": 335,
    "method": "credit",
    "createdAt": "2025-11-23T12:46:47.712Z"
  },
  {
    "_id": "6923032434f1f089a8bbc1a6",
    "order": "6923012234f1f089a8bbc18c",
    "customer": "6923012134f1f089a8bbc18a",
    "amount": 200,
    "method": "cash",
    "createdAt": "2025-11-23T12:50:44.335Z"
  }
]
```

---

## Important Notes

### Credit Tracking

Payments recorded as credit are automatically tracked and update the `creditBalance` of the associated customer. This allows businesses to maintain accurate records of customer credit accounts.

### Stock Validation

For any product where `requiresStock` is set to `true`, the API enforces stock availability before an order can be created. This prevents overselling and maintains inventory accuracy.

### Payment Status

Orders can have the following payment statuses:

- **pending**: No payment has been made
- **partial**: Some payment has been made, but not the full amount
- **paid**: Full payment has been received

---

## Getting Started

1. Authenticate using the `/api/auth/login` endpoint to receive your JWT token
2. Include the token in the `Authorization` header for all subsequent requests
3. Create orders, manage customers, and process payments through the respective endpoints

For support or questions, please contact your system administrator.
