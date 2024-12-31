"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Carts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false, // UserId should not be null
        references: {
          model: "Users", // Reference to the Users table
          key: "id", // The column in Users table that it references
        },
        onDelete: "CASCADE", // If a user is deleted, remove their cart items
      },
      ProductId: {
        type: Sequelize.INTEGER,
        allowNull: false, // ProductId should not be null
        references: {
          model: "Products", // Reference to the Products table
          key: "id", // The column in Products table that it references
        },
        onDelete: "CASCADE", // If a product is deleted, remove it from all carts
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false, // Quantity cannot be null
        defaultValue: 1, // Default quantity is 1
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
    await queryInterface.dropTable("Carts");
  },
};
