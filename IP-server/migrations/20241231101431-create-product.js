"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false, // Name is required
      },
      description: {
        type: Sequelize.STRING(2000),
        allowNull: false, // Description is required
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false, // Price is required
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false, // Stock is required
      },
      imgUrl: {
        type: Sequelize.STRING,
        allowNull: false, // Image URL is required
      },
      CategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false, // CategoryId is required
        references: {
          model: "Categories", // Refers to the Categories table
          key: "id", // Refers to the 'id' column in Categories table
        },
        onDelete: "CASCADE", // If a category is deleted, its associated products are deleted
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
    await queryInterface.dropTable("Products");
  },
};
