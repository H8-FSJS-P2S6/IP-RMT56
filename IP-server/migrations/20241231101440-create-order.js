"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Refers to the 'Users' table
          key: "id", // Refers to the 'id' column in Users
        },
        onDelete: "CASCADE", // Deletes orders if a user is deleted
      },
      totalPrice: {
        type: Sequelize.FLOAT,
        allowNull: false, // Total price is required
      },
      orderStatus: {
        type: Sequelize.ENUM("pending", "completed", "cancelled"), // Enum values for order status
        allowNull: false,
        defaultValue: "pending", // Default value if none is provided
      },
      paymentStatus: {
        type: Sequelize.ENUM("unpaid", "paid", "failed"), // Enum values for payment status
        allowNull: false,
        defaultValue: "unpaid", // Default value if none is provided
      },
      paymentId: {
        type: Sequelize.STRING,
        allowNull: true, // Payment ID is optional: not every order may have a payment ID associated with it at the time of creation (pending orders, offline payments, payment failures, prepaid orders)
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
    // Drop the Orders table
    await queryInterface.dropTable("Orders");
  },
};
