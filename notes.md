Server

- npm init -y

- npm install express cors pg sequelize dotenv bcryptjs jsonwebtoken

- npm install --save-dev nodemon sequelize-cli

- touch .gitignore .env .env_example -> node_modules .env

.env_example
JWT_SECRET_KEY="FILL ME HERE"
PORT=FILL ME HERE
NODE_ENV=FILL ME HERE
DATABASE_URL="FILL ME HERE"

- npx sequelize init

- edit config > config.json (name & username "postgres", database_name, dialect "postgres", port 5433, AND PRODUCTION use_env_variable)
  {
  "development": {
  "username": "postgres",
  "password": "postgres",
  "database": "IP",
  "host": "127.0.0.1",
  "dialect": "postgres",
  "port": 5433
  },
  "test": {
  "username": "postgres",
  "password": "postgres",
  "database": "IP_test",
  "host": "127.0.0.1",
  "dialect": "postgres",
  "port": 5433
  },
  "production": {
  "use_env_variable": "DATABASE_URL"
  }
  }

- create bin/www.js
  mkdir bin
  touch bin/www.js

script www.js:
const {app} = require('../app')

if (process.env.NODE_ENV !== 'production') {
require('dotenv').config()
}
const port = process.env.PORT || 3000;

app.listen(port, () => {
console.log(`Example app listening on port ${port}`);
});

- edit scripts in package.json:
  "dev": "npx nodemon bin/www.js",
  "resdbdev": "npx sequelize db:drop && npx sequelize db:create && npx sequelize db:migrate:undo:all && npx sequelize db:migrate && npx sequelize db:seed:all",
  "resdbtest": "npx sequelize db:drop --env test && npx sequelize db:create --env test && npx sequelize db:migrate --env test && npx sequelize db:seed:all --env test",
  "seed": "npx sequelize db:migrate --env test && npx sequelize db:seed:all --env test"

---**\*\*\*\***\*\*\*\***\*\*\*\***\Creating Models\***\*\*\*\***\*\*\*\***\*\*\*\***

- npx sequelize db:create

- npx sequelize model:generate --name User --attributes username:string,email:string,password:string,role:string
