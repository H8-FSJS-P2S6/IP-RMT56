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
      transactionId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      orderId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      grossAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      paymentType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      transactionStatus: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      transactionTime: {
        type: Sequelize.DATE,
        allowNull: false,
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
