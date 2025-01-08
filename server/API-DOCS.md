# DOCUMENTATION

## POST /register

### Request Header:

```json
{
  "Authorization": "Bearer <your access token>"
}
```

### Request Body:

```json
{
  "email": "test@mail.com",
  "password": "test123"
}
```

### Response (201 - Created):

```json
{
    "id": 2,
    "email": "lulu@mail.com"
}
```

### Response (401 - Unoauthorize Register):

```json
{
  "message": "Invalid Token"
}
```

### Response (403 - Forbidden Register):

```json
{
  "message": "You don't have access"
}
```

### Response (400 - Failed Register):

```json
{
  "message": "Email is required"
}
OR
{
  "message": "Invalid email format"
}
OR
{
  "message": "Email must be unique"
}
OR
{
  "message": "Password is required"
}
```

### Response (500 - Internal Server Error):

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## POST /login

### Request Body:

```json
{
  "email": "ponyo@mail.com",
  "password": "test123"
}
```

### Response (200 - Success Login):

```json
{
  "access_token": "<your access token",
  "userId": 1
}
```

### Response (400 - Failed Login):

```json
{
  "message": "Email is required"
}
OR
{
  "message": "Invalid email format"
}
OR
{
  "message": "Email must be unique"
}
OR
{
  "message": "Password is required"
}
```

### Response (500 - Internal Server Error):

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## GET /pub

### Request Header:

```json
{
  "Authorization": "Bearer <your access token>"
}
```

### Response (200 - Success get pub):

```json

{
    "pokemons": [
        {
            "id": 1,
            "name": "bulbasaur",
            "url": "https://pokeapi.co/api/v2/pokemon/1/"
        },
        {
            "id": 2,
            "name": "ivysaur",
            "url": "https://pokeapi.co/api/v2/pokemon/2/"
        },
        {
            "id": 3,
            "name": "venusaur",
            "url": "https://pokeapi.co/api/v2/pokemon/3/"
        },
        {
            "id": 4,
            "name": "charmander",
            "url": "https://pokeapi.co/api/v2/pokemon/4/"
        },
        {
            "id": 5,
            "name": "charmeleon",
            "url": "https://pokeapi.co/api/v2/pokemon/5/"
        },
        {
            "id": 6,
            "name": "charizard",
            "url": "https://pokeapi.co/api/v2/pokemon/6/"
        },
        {
            "id": 7,
            "name": "squirtle",
            "url": "https://pokeapi.co/api/v2/pokemon/7/"
        },
        {
            "id": 8,
            "name": "wartortle",
            "url": "https://pokeapi.co/api/v2/pokemon/8/"
        },
        {
            "id": 9,
            "name": "blastoise",
            "url": "https://pokeapi.co/api/v2/pokemon/9/"
        }
    ],
    "page": 1,
    "limit": 9,
    "total": 1302,
    "totalPages": 145
}
```

### Response (401 - Unoauthorize Get Pub):

```json
{
  "message": "Invalid Token"
}
```

### Response (500 - Internal Server Error):

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

