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

## POST /gemini-ask

### Request Header:

```json
{
  "Authorization": "Bearer <your access token>"
}
```

### Request Body:

```json
{
  "promptUser": "hallo"
}
```

### Response (201 - Created):

```json
{
   "Welcome to the world of Pokémon!  Let's go on an adventure!  What would you like to do?  Do you want to:\n\n* **Choose a starter Pokémon?**\n* **Battle a Gym Leader?**\n* **Catch some Pokémon?**\n* **Explore a new region?**\n\nTell me what you'd like to do!\n"
}
```

### Response (400 - Bad Request):

```json
{
  "message": "string"
}
```

### Response (500 - Internal Server Error):

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## POST /mypokemons

### Request Header:

```json
{
  "Authorization": "Bearer <your access token>"
}
```

### Response (200 - Success Post myPokemons):

```json

{
    "id": 10,
    "userId": 1,
    "pokemonId": 10,
    "createdAt": "2025-01-09T14:11:25.422Z",
    "updatedAt": "2025-01-09T14:11:25.422Z",
    "pokemon": {
        "id": 10,
        "name": "caterpie",
        "url": "https://pokeapi.co/api/v2/pokemon/10/"
    }
}
```

### Response (400 - Unoauthorize Post myPokemons):

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

## GET /mypokemons

### Request Header:

```json
{
  "Authorization": "Bearer <your access token>"
}
```

### Response (200 - Success get myPokemons):

```json

{
    {
        "id": 1,
        "userId": 1,
        "pokemonId": 1,
        "createdAt": "2025-01-09T13:40:02.971Z",
        "updatedAt": "2025-01-09T13:40:02.971Z",
        "pokemon": {
            "id": 1,
            "name": "bulbasaur",
            "url": "https://pokeapi.co/api/v2/pokemon/1/"
        }
    },
    {
        "id": 2,
        "userId": 1,
        "pokemonId": 2,
        "createdAt": "2025-01-09T13:42:43.621Z",
        "updatedAt": "2025-01-09T13:42:43.621Z",
        "pokemon": {
            "id": 2,
            "name": "ivysaur",
            "url": "https://pokeapi.co/api/v2/pokemon/2/"
        }
    },
    {
        "id": 3,
        "userId": 1,
        "pokemonId": 3,
        "createdAt": "2025-01-09T13:49:49.752Z",
        "updatedAt": "2025-01-09T13:49:49.752Z",
        "pokemon": {
            "id": 3,
            "name": "venusaur",
            "url": "https://pokeapi.co/api/v2/pokemon/3/"
        }
    },
}
```

### Response (400 - Unoauthorize Get myPokemons):

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

## GET /mypokemons/:id

### Request Header:

```json
{
  "Authorization": "Bearer <your access token>"
}
```

### Response (200 - Success get myPokemons/id ):

```json

{
    "id": 1,
    "userId": 1,
    "pokemonId": 1,
    "createdAt": "2025-01-09T13:40:02.971Z",
    "updatedAt": "2025-01-09T13:40:02.971Z",
    "pokemon": {
        "id": 1,
        "name": "bulbasaur",
        "url": "https://pokeapi.co/api/v2/pokemon/1/"
    }
}
```

### Response (400 - Unoauthorize Get myPokemons/:id):

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

## PUT /mypokemons/:id

### Request Header:

```json
{
  "Authorization": "Bearer <your access token>"
}
```

### Response (200 - Success put myPokemons/:id):

```json

{
    {
        "id": 1,
        "userId": 1,
        "pokemonId": 1,
        "createdAt": "2025-01-09T13:40:02.971Z",
        "updatedAt": "2025-01-09T13:40:02.971Z",
        "pokemon": {
            "id": 1,
            "name": "bulbasaur",
            "url": "https://pokeapi.co/api/v2/pokemon/1/"
        }
    },
    {
        "id": 2,
        "userId": 1,
        "pokemonId": 2,
        "createdAt": "2025-01-09T13:42:43.621Z",
        "updatedAt": "2025-01-09T13:42:43.621Z",
        "pokemon": {
            "id": 2,
            "name": "ivysaur",
            "url": "https://pokeapi.co/api/v2/pokemon/2/"
        }
    },
    {
        "id": 3,
        "userId": 1,
        "pokemonId": 3,
        "createdAt": "2025-01-09T13:49:49.752Z",
        "updatedAt": "2025-01-09T13:49:49.752Z",
        "pokemon": {
            "id": 3,
            "name": "venusaur",
            "url": "https://pokeapi.co/api/v2/pokemon/3/"
        }
    },
}
```

### Response (400 - Unoauthorize Put myPokemons/:id):

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

## DELETE /mypokemons/:id

### Request Header:

```json
{
  "Authorization": "Bearer <your access token>"
}
```

### Response (204 - Success get myPokemons):

```json

{
   "message": "string" 
}
```

### Response (400 - Unoauthorize Delete myPokemons/:id):

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

