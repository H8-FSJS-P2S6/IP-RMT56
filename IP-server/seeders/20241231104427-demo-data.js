"use strict";

const { hashPassword } = require("../helpers/bycriptjs");
const category = require("../models/category");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    let users = require("../data/user.json");
    const hashedData = users.map((el) => {
      const hashedPassword = hashPassword(el.password);
      return {
        email: el.email,
        password: hashedPassword,
        name: el.name,
        role: el.role,
        phoneNumber: el.phoneNumber,
        address: el.address,
        gender: el.gender,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    let categories = require("../data/category.json");
    categories = categories.map((el) => {
      return {
        ...el,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    let faqs = require("../data/faq.json");
    faqs = faqs.map((el) => {
      return {
        ...el,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    let products = require("../data/product.json");
    products = products.map((el, i) => {
      const currentTimeDelayed = new Date(new Date().getTime() + i * 1000);
      return {
        ...el,
        createdAt: currentTimeDelayed,
        updatedAt: currentTimeDelayed,
      };
    });
    await queryInterface.bulkInsert("Users", hashedData);
    await queryInterface.bulkInsert("Categories", categories);
    await queryInterface.bulkInsert("FAQs", faqs);
    await queryInterface.bulkInsert("Products", products);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Categories", null, {});
    await queryInterface.bulkDelete("FAQs", null, {});
    await queryInterface.bulkDelete("Products", null, {});
  },
};
