"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false, // Ensure email is not null
        unique: true, // Ensure email is unique
        validate: {
          isEmail: {
            // Validate email format
            msg: "Invalid email format",
          },
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false, // Ensure password is not null
        validate: {
          len: {
            args: [6], // Password length must be at least 6 characters
            msg: "Password must be at least 6 characters long",
          },
        },
      },
      name: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: "Customer", // Default value for role is 'Customer'
      },
      phoneNumber: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.ENUM("male", "female"), // Gender field as enum
        allowNull: true, // Allowing null value for gender (optional)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
