const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('admin', [
      {
        id: uuidv4(),
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
