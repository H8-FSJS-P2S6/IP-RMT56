"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OrderCarts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      OrderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Orders", // Refers to the Orders table
          key: "id", // Refers to the id column in Orders
        },
        onDelete: "CASCADE", // If an order is deleted, its OrderCarts are deleted
      },
      ProductId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Products", // Refers to the Products table
          key: "id", // Refers to the id column in Products
        },
        onDelete: "CASCADE", // If a product is deleted, it will be removed from the cart
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false, // Quantity is required
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false, // Price is required
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
    await queryInterface.dropTable("OrderCarts");
  },
};
