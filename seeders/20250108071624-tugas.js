const { v4: uuidv4 } = require('uuid');

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tugas', [
      {
        id: uuidv4(),
        judul_tugas: 'Tugas 1: Implementasi Sistem Informasi Pengelolaan barang',
        deskripsi_tugas: 'Tugas ini mengharuskan mahasiswa untuk mengimplementasikan sistem informasi berbasis web.',
        deadline: new Date('2025-02-28'),
        id_user: '640fe982-5a6b-47fc-801f-fccb95e25179',  // Ganti dengan ID mahasiswa yang valid
        id_admin: '27273c91-e4a7-4517-b6c7-d02e28a709d1',      // Ganti dengan ID admin yang valid
        status: 'Belum Selesai',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tugas', null, {});
  }
};
