const bcrypt = require('bcrypt');

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('admin', [
      {
        username: 'admin',
        password: await bcrypt.hash('123', 10),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

  

    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('admin', null, {});
  }
};
