//create user
method: POST
url:
http://localhost:5000/api/auth/register
json body:
{
"email": "sueradmin@gmail.com",
"password": "superadmin"
}

//login user
method: POST
url:
http://localhost:5000/api/auth/login
json body:
{
"email": "sueradmin@gmail.com",
"password": "superadmin"
}

//create new staff user
method: POST
url:
http://localhost:5000/api/auth/staff
headers:
Authorization
Bearer <token>
json
body:
{
"name": "cashier1",
"email": "cahsier1@gmail.com",
"password": "cashier1",
"role": "cashier"
}

//get profile
method: GET
url:
http://localhost:5000/api/auth/profile
headers:
Authorization  
Bearer <token>

//update profile
method: PUT
url:
http://localhost:5000/api/auth/profile
headers:
Authorization  
Bearer <token>
json body:
{
"name": "superadmin updated",
"email": "superadmin@gmail.com",
"password": "superadminupdated"
}

/// only waiter can create waiter order
url /api/orders/waiter

/// update waiter order
url /api/orders/waiter/:id
method: PUT

body
{

"remarks": "Extra butter",
"items": [
{
"product": "69441bb7d04c1b88fdb1a8d9",
"quantity": 1
}
]
}

///delete order from cashier only cashier and admin

mehtod delete url /api/orders/:id

req body
reason:"Customer cancelled the order"
or default order.deleteReason = req.body.reason || "Admin removed order";

res
{
"message": "Order deleted (logged)"
}
//
