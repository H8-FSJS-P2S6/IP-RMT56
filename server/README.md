# IP-RMT56

# your Guitar API Documentation

## Endpoints

List of available endpoints:

- `POST /login`
- `POST /register`
- `POST /googleLogin`
- `POST /githubLogin`

Routes below need authentication:

- `GET /profile`
- `PUT /profile/preference`
- `GET /products`
- `GET /products/recommendation`
- `GET /cart`
- `POST /cart`
- `PUT /cart/:id`
- `DELETE /cart/:id`

&nbsp;

## 1. GET POST /login

Description:

- Login into the system

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string"
}
```

_Response (400 - BadRequest) Email/Username is required_

```json
{
  "message": "Email is required"
}
```

_Response (400 - BadRequest) Password is required_

```json
{
  "message": "Password is required"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid email or password"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Our system is currently down. Please try again later"
}
```

&nbsp;

## 2. POST /register

Description:

- Register a new user into the system

Request:

- body:

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}

```

_Response (201 - Created)_

```json
{
  "message": "Register successful",
  "id": "integer",
  "username": "string"
}
```

_Response (400 - BadRequest) Name is required_

```json
{
  "message": "Name is required"
}
```

_Response (400 - BadRequest) Email is required_

```json
{
  "message": "Email is required"
}
```
_Response (400 - BadRequest) Password is required_

```json
{
  "message": "Password is required"
}
```
_Response (500 - Internal Server Error)_

```json
{
  "message": "Our system is currently down. Please try again later"
}
```

&nbsp;

## 3. POST /googleLogin

Description:

- Login or register a user using Google authentication.

Request:

- body:

```json
{
  "googleToken": "string"
}
```

_Response (200 - OK)_

```json
{
  "message": "Login success",
  "access_token": "string"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Our system is currently down. Please try again later"
}
```

&nbsp;

## 4. POST /githubLogin

Description:

- Login or register a user using GitHub authentication

Request:

- body:

```json
{
  "code": "string"
}
```

_Response (200 - OK)_

```json
{
  "message": "Login success",
  "access_token": "string"
}
```

_Response (400 - BadRequest) GitHub login failed_

```json
{
  "message": "GitHub login failed"
}
```

_Response (400 - BadRequest) Unable to retrieve verified email_

```json
{
  "message": "Unable to retrieve verified email"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Our system is currently down. Please try again later"
}
```

&nbsp;

## 5. GET /profile

Description:

- Retrieve the profile information of the logged-in user

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (201 - Created)_

```json
 {
  "id": "integer",
  "name": "string",
  "email": "string",
  "brand": "string",
  "type": "string",
  "price_range": {
    "min_price": "integer",
    "max_price": "integer"
  },
}

```

_Response (404 - NotFound)_

```json
{
  "message": "User not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Our system is currently down. Please try again later"
}
```

&nbsp;

## 6. PUT /profile/preference

Description:

- Update the user's preferences, including brand, type, and price range.

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- body:

```json
{
  "brand": "string",
  "type": "string",
  "price_range": {
    "min_price": "integer",
    "max_price": "integer"
  }
}
```

_Response (200 - OK)_

```json
{
  "message": "Preferences updated successfully",
  "id": "integer",
  "name": "string",
  "email": "string",
  "brand": "string",
  "type": "string",
  "price_range": {
    "min_price": "integer",
    "max_price": "integer"
  }
}
```

_Response (400 - BadRequest) Brand is Required_

```json
{
  "message": "Brand is Required"
}
```

_Response (400 - BadRequest) Type is Required_

```json
{
  "message": "Type is Required"
}
```

_Response (400 - BadRequest) Both min price and max price must be provided_

```json
{
  "message": "Both min price and max price must be provided"
}
```

_Response (400 - BadRequest) Min price must be less than Max price_

```json
{
  "message": "Min price must be less than Max price"
}
```

_Response (404 - NotFound) User not found_

```json
{
  "message": "User not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Our system is currently down. Please try again later"
}
```

## 7. GET /products

Description:

- Retrieve a list of guitars based on optional search filters for name, brand, and type

Request:

- Query Parameters:
  - q (optional): A search term for the guitar name
  - brand (optional): A filter for the guitar's brand
  - type (optional): A filter for the guitar's type

Example:
```
/products?q=Stratocaster&brand=Fender&type=Electric
```

- headers:
```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": "integer",
    "name": "string",
    "brand": "string",
    "type": "string",
    "price": "integer",
    "description": "string"
  }
]
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Our system is currently down. Please try again later"
}
```

## 8. GET /products/recommendation

Description:

- Retrieve a list of AI-generated product recommendations based on the user's preferences, including brand, type, and price range

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": "integer",
    "imgUrl": "string",
    "name": "string",
    "brand": "string",
    "type": "string",
    "price": "integer",
  }
]

```

_Response (404 - Not Found)_

```json
{
  "message": "No matching products found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Our system is currently down. Please try again later"
}
```

## 9. POST /cart

Description:

- Add a product to the user's cart

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- body:

```json
{
  "productId": "integer"
}
```

_Response (201 - Created)_

```json
{
  "message": "Product with Id {productId} added to cart"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Our system is currently down. Please try again later"
}
```

## 10. GET /cart

Description:

- Retrieve the list of products in the user's cart

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": "integer",
    "userId": "integer",
    "productId": "integer",
    "quantity": "integer",
    "Product": {
      "id": "integer",
      "imgUrl": "string",
      "name": "string",
      "brand": "string",
      "type": "string",
      "price": "integer"
    }
  }
]
```

- If the cart is empty:
```json
{
  "message": "Your cart is empty"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Our system is currently down. Please try again later"
}
```

## 11. PUT /cart/:id

Description:

- Update the quantity of a product in the user's cart

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- params:

```json
{
  "id": "number (required)"
}
```

- body:
```json
{
  "quantity": "integer"
}
```

_Response (200 - OK)_
```json
{
  "message": "Cart item updated successfully.",
  "cartItem": {
    "id": "integer",
    "userId": "integer",
    "productId": "integer",
    "quantity": "integer"
  }
}
```

_Response (400 - BadRequest)_
- If the quantity is less than 1:
```json
{
  "message": "Quantity must be at least 1"
}
```

_Response (404 - NotFound)_
```json
{
  "message": "Product not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Our system is currently down. Please try again later"
}
```

## 12. DELETE /cart/:id

Description:

- Remove a specific product from the user's cart based on its cart item ID

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- params:

```json
{
  "id": "number (required)"
}
```

_Response (200 - OK)_
```json
{
  "message": "Product Id: {id} removed from cart"
}
```

_Response (404 - NotFound)_
```json
{
  "message": "Product not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Our system is currently down. Please try again later"
}
```
