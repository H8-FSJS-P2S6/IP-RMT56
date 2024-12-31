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

<!-- Create All Tables -->

- npx sequelize model:generate --name User --attributes email:string,password:string,name:string,role:string,phoneNumber:string,address:string,gender:string

- npx sequelize model:generate --name Cart --attributes UserId:integer,ProductId:integer,quantity:integer

- npx sequelize model:generate --name Order --attributes UserId:integer,totalPrice:float,orderStatus:string,paymentStatus:string,paymentId:string

- npx sequelize model:generate --name OrderCart --attributes OrderId:integer,ProductId:integer,quantity:integer,price:float

- npx sequelize model:generate --name Product --attributes name:string,description:string,price:float,stock:integer,imgUrl:string,CategoryId:integer

- npx sequelize model:generate --name Category --attributes name:string

- npx sequelize model:generate --name FAQ --attributes question:string,answer:string

<!-- Add FK, association, and validation -->

Tambahkan constraint unique, isEmail, notNull ke migration User.email
Tambahkan foreignKey di migration table Grocery
Tambahkan association di model

<!-- Migrate columns -->

- npx sequelize db:migrate

<!-- Create seeding -->

- npx sequelize seed:generate --name demo-faqs
- npx sequelize seed:generate --name demo-products
- npx sequelize seed:generate --name demo-users

<!-- In seeding User, create helpers for hashPassword -->

- mkdir helpers middlewares
- touch helpers/bycriptjs.js helpers/jwt.js middlewares/authentication.js

<!-- Script In bycript.js: -->

const bcrypt = require('bcryptjs')

const hashPassword = (password) => {
return bcrypt.hashSync(password)
}

const comparePassword = (password, hashedPassword) => {
return bcrypt.compareSync(password, hashedPassword)
}

module.exports = { hashPassword, comparePassword}

<!-- Script in jwt.js -->

var jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_KEY

function signToken(data) {
return jwt.sign(data, secretKey);
}
function verifyToken(data) {
return jwt.verify(data, secretKey);
}

module.exports = {signToken, verifyToken}

<!-- Script in middlewares/authentication.js -->

const {User} = require('../models')
const {verifyToken} = require('../helpers/jwt')

module.exports = async function authenthication(req, res, next){
const bearerToken = req.headers.authorization
if (!bearerToken) {
next({name: 'Unauthorized', message: 'Token is required'})
return
}
const [, token] = bearerToken.split(' ')
if (!token) {
next({name: 'Unauthorized', message: 'Invalid token format'})
return
}
try {
const data = verifyToken(token)
const user = await User.findByPk(data.id)
if(!user) {
next({name: 'Unauthorized', message: 'User not found'})
return
}
req.user = user
next()
} catch (error) {
if (error.name === 'TokenExpiredError') {
return next({ name: 'Unauthorized', message: 'Token has expired' });
}
next(error);
}
}
