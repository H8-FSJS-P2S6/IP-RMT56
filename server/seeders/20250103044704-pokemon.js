'use strict';
const axios = require ("axios");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
      const response = await axios.get("https://pokeapi.co/api/v2/pokemon/");
      //console.log(response.data.result);
      const pokemons = response.data.results.map((pokemon) => {
        return {
          name: pokemon.name,
          url: pokemon.url,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
    });

    await queryInterface.bulkInsert("Pokemons", pokemons);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Pokemons", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  }
};
