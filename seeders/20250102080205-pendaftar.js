'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('pendaftar', [
      {
        id_admin: 1, // Pastikan ID admin ini sesuai dengan data di tabel `admin`.
        email: 'john.doe@example.com',
        nim: '12345678',
        nama: 'John Doe',
        universitas: 'Universitas Indonesia',
        jurusan: 'Teknik Informatika',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_admin: 1, // Pastikan ID admin ini sesuai dengan data di tabel `admin`.
        email: 'jane.smith@example.com',
        nim: '87654321',
        nama: 'Jane Smith',
        universitas: 'Institut Teknologi Bandung',
        jurusan: 'Sistem Informasi',
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_admin: 1, // Pastikan ID admin ini sesuai dengan data di tabel `admin`.
        email: 'michael.jones@example.com',
        nim: '11223344',
        nama: 'Michael Jones',
        universitas: 'Universitas Gadjah Mada',
        jurusan: 'Manajemen Informatika',
        status: 'rejected',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pendaftar', null, {});
  }
};
