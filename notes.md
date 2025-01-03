Server

- npm init -y

- npm install express cors pg sequelize dotenv bcryptjs jsonwebtoken body-parser

- npm install --save-dev nodemon sequelize-cli

- touch app.js
  <!-- app.js -->
  require("dotenv").config();
  const express = require("express");

const app = express();

const router = require("./routers");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router);

module.exports = { app };

- mkdir routers
- touch routers/index.js
  <!-- Script router > index.js -->
  const express = require('express')
  const Controller = require('../controllers/controller');
  const authentication = require('../middlewares/authentication');
  const { guardAdminStaffCreated } = require('../middlewares/guardAdminStaffCreated')
  const { guardAdminOnly } = require('../middlewares/guardAdminOnly')
  const router = express.Router()
  const multer = require('multer')
  const upload = multer({ storage: multer.memoryStorage() })

router.get("/", (req, res) => res.json({ message: 'Hello World!' }));

// for public
router.get("/pub/products", Controller.getProductsPublic);
router.get("/pub/products/:id", Controller.getProductsByIdPublic);

// login
router.post("/login", Controller.login);

router.use(authentication)

// add-user (admin only)
router.post("/add-user", guardAdminOnly, Controller.addUser);

router.get("/products", Controller.getProducts);
router.post("/products", Controller.createProduct);
router.get("/products/:id", Controller.getProductsById);

// need guardAdminStaffCreated
router.put("/products/:id", guardAdminStaffCreated, Controller.updateProductById);
router.delete("/products/:id", guardAdminStaffCreated, Controller.deleteProductById);

router.get("/categories", Controller.getCategories);
router.post("/categories", Controller.createCategory);
router.put("/categories/:id", guardAdminStaffCreated, Controller.updateCategoryById);
router.patch("/products/:id/imgUrl", guardAdminStaffCreated, upload.single("avatar"), Controller.updateProductImageById);

function errorHandler(err, req, res, next) {
console.log("🚀 ~ errorHandler ~ err:", err)
switch (err.name) {
case 'SequelizeValidationError':
case 'SequelizeUniqueConstraintError':
return res.status(400).json({ message: err.errors[0].message })
case 'CustomValidation':
return res.status(400).json({ message: err.message })
case 'BadRequest':
return res.status(400).json({ message: err.message })
case 'Unauthorized':
return res.status(401).json({ message: err.message ?? 'Invalid token' })
case 'JsonWebTokenError':
return res.status(401).json({ message: 'Invalid token' })
case 'Forbidden':
return res.status(403).json({ message: 'You are not Authorized' })
case 'Not Found':
return res.status(404).json({ message: err.message })
default:
res.status(500).json({ message: 'Internal Server Error' })
}
}

router.use(errorHandler)

module.exports = router

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

<!-- hooks beforeCreate in User Model -->

"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bycriptjs");

module.exports = (sequelize, DataTypes) => {
class User extends Model {
/\*\*
_ Helper method for defining associations.
_ This method is not a part of Sequelize lifecycle.
_ The `models/index` file will call this method automatically.
_/
static associate(models) {
// Example of a one-to-many relationship with Cart
// A User can have multiple Cart items
User.hasMany(models.Cart, {
foreignKey: "UserId",
as: "carts",
});

      // Example of a one-to-many relationship with Order
      // A User can have multiple Orders
      User.hasMany(models.Order, {
        foreignKey: "UserId",
        as: "orders",
      });
    }

}

User.init(
{
email: {
type: DataTypes.STRING,
allowNull: false,
unique: true, // Ensure email is unique
validate: {
isEmail: {
msg: "Invalid email format",
},
},
},
password: {
type: DataTypes.STRING,
allowNull: false, // Password is required
validate: {
len: {
args: [6], // Password must be at least 6 characters long
msg: "Password must be at least 6 characters long",
},
},
},
name: {
type: DataTypes.STRING,
},
role: {
type: DataTypes.STRING,
defaultValue: "Customer", // Default role is 'Customer'
},
phoneNumber: {
type: DataTypes.STRING,
},
address: {
type: DataTypes.STRING,
},
gender: {
type: DataTypes.ENUM("male", "female"), // Gender field as enum
allowNull: true, // Allow null if you don't want to enforce gender
},
},
{
sequelize,
modelName: "User",
}
);
User.beforeCreate(async (user) => {
const hashedPassword = hashPassword(user.password);
user.password = hashedPassword;
});
return User;
};

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

<!-- Controllers -->

mkdir controllers
touch controllers/controller.js

<!-- Test endpoints -->

npm install --save-dev jest supertest
mkdir **tests**
touch **tests**/test.js
