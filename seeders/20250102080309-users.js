'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('123', 10);

    await queryInterface.bulkInsert('users', [
      {
        id_pendaftar: 2, // Pastikan ID pendaftar ini sesuai dengan data di tabel `pendaftar`.
        username: 'janesmith',
        password: hashedPassword,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
