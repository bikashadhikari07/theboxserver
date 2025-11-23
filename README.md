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

## API Endpoints

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

### 3. Create POS Order

Create a new point of sale order. **Admin only**.

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

**Endpoint**: `POST /api/payments/:id`

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