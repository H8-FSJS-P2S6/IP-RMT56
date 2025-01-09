# Unikloh E-commerce API Documentation

## Endpoints

List of available endpoints:

1. `POST /login`
2. `POST /register`
3. `GET /pub/products`
4. `GET /pub/products/:id`
5. `GET /pub/faqs`

Routes below need authentication:

6. `GET /products`
7. `GET /products/:id`
8. `GET /categories`
9. `GET /cart`
10. `POST /cart/:id`
11. `PUT /cart/:id`
12. `DELETE /cart/:id`
13. `GET /faqs`
14. `GET /orders`
15. `POST /orders`
16. `GET /orders/:orderId`
17. `POST /generate-midtrans-token`
18. `POST /chat`

---

## 1. POST /login

**Description:**

- Authenticates a user and returns a JWT token. Requires either a username or email and a password.

**Request:**

- Body:

```json
{
  "email": "string",
  "password": "string"
}

Response (201 - Created):
{
  "access_token": "string"
}

Response (400 - Bad Request):
{
  "message": "Email is required"
}
or
{
  "message": "Password is required"
}

Response (401 - Unauthorized):
{
  "message": "Invalid email or password"
}

```

2. POST /register
   Description:

Registers a new user with email and password.
Request:

Body:
{
"email": "user1@mail.com",
"password": "123456"
}

Response (201 - Created):

{
"message": "User registered successfully"
}

3. GET /pub/products
   Description:

Fetches a list of public products.
Response (200 - OK):

[
{
"id": 1,
"name": "Product 1",
"description": "Description of Product 1",
"price": 100.00
},
{
"id": 2,
"name": "Product 2",
"description": "Description of Product 2",
"price": 150.00
}
] 4. GET /pub/products/:id
Description:

Fetches a product by its ID.
URL Parameters:

id: The product ID.
Response (200 - OK):

{
"id": 1,
"name": "Product 1",
"description": "Description of Product 1",
"price": 100.00
} 5. GET /pub/faqs
Description:

Fetches public FAQs.
Response (200 - OK):

[
{
"id": 1,
"question": "What payment methods do you accept?",
"answer": "We accept various methods including credit cards, PayPal, and more."
},
{
"id": 2,
"question": "What is your return policy?",
"answer": "Our return policy allows returns within 30 days of purchase."
}
] 6. GET /products
Description:

Fetches a list of all products. Authentication required.
Response (200 - OK):

[
{
"id": 1,
"name": "Product 1",
"description": "Description of Product 1",
"price": 100.00
}
]

7. GET /products/:id
   Description:

Fetches a product by its ID. Authentication required.
URL Parameters:

id: The product ID.
Response (200 - OK):

{
"id": 1,
"name": "Product 1",
"description": "Description of Product 1",
"price": 100.00
} 8. GET /categories
Description:

Fetches a list of categories. Authentication required.
Response (200 - OK):

[
{
"id": 1,
"name": "Category 1"
}
] 9. GET /cart
Description:

Fetches the user's cart items. Authentication required.
Response (200 - OK):

[
{
"productId": 1,
"quantity": 2,
"price": 200.00
}
] 10. POST /cart/:id
Description:

Adds an item to the user's cart. Authentication required.
URL Parameters:

id: The product ID to add to the cart.
Response (200 - OK):

{
"message": "Product added to cart"
} 11. PUT /cart/:id
Description:

Updates the quantity of a product in the user's cart. Authentication required.
URL Parameters:

id: The product ID.
Request:

Body:

{
"quantity": 3
}
Response (200 - OK):

{
"message": "Cart item updated"
} 12. DELETE /cart/:id
Description:

Removes a product from the user's cart. Authentication required.
URL Parameters:

id: The product ID to remove from the cart.
Response (200 - OK):

{
"message": "Cart item removed"
} 13. GET /faqs
Description:

Fetches FAQs for logged-in users.
Response (200 - OK):

[
{
"id": 1,
"question": "How can I contact customer support?",
"answer": "You can contact us through the support page or email."
}
] 14. GET /orders
Description:

Fetches the user's orders. Authentication required.
Response (200 - OK):

[
{
"id": 1,
"status": "pending",
"total": 300.00
}
] 15. POST /orders
Description:

Creates a new order. Authentication required.
Request:

Body:

{
"cartId": 1,
"shippingAddress": "123 Street, City, Country"
}
Response (201 - Created):

{
"message": "Order created successfully"
} 16. GET /orders/:orderId
Description:

Fetches the details of a specific order. Authentication required.
URL Parameters:

orderId: The order ID.
Response (200 - OK):

{
"id": 1,
"status": "pending",
"items": [
{
"productId": 1,
"quantity": 2,
"price": 100.00
}
],
"total": 200.00
} 17. POST /generate-midtrans-token
Description:

Generates a token for Midtrans payment gateway. Authentication required.
Request:

Body:

{
"orderId": 1
}
Response (200 - OK):

{
"token": "midtrans_token_string"
} 18. POST /chat
Description:

Initiates a conversation with the AI chatbot.
Request:

Body:

{
"message": "How can I track my order?"
}
Response (200 - OK):

{
"response": "You can track your order through the 'My Orders' page."
}

Global Errors:
Response (500 - Internal Server Error):

```json
{
  "message": "Internal Server Error"
}
```
