'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('biodata', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_users: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      nomor_peserta: {
        type: Sequelize.STRING,
        unique: true
      },
      nama_lengkap: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nama_panggilan: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tempat_lahir: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tanggal_lahir: { 
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      anak_ke: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      jumlah_saudara: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      IP: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      nama_ibu: {
        allowNull: false,
        type: Sequelize.STRING
      },
      pekerjaan_ibu: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nama_ayah: {
        allowNull: false,
        type: Sequelize.STRING
      },
      pekerjaan_ayah: {
        allowNull: false,
        type: Sequelize.STRING
      },
      agama: {
        allowNull: false,
        type: Sequelize.STRING
      },
      no_hp: {
        allowNull: false,
        type: Sequelize.STRING
      },
      alamat: {
        allowNull: false,
        type: Sequelize.STRING
      },
      alamat_domisili: {
        allowNull: false,
        type: Sequelize.STRING
      },
      alasan: {
        allowNull: false,
        type: Sequelize.STRING
      },
      jadwal_mulai: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      jadwal_selesai: {
        allowNull: false,
        type: Sequelize.DATEONLY
      }, 
      keahlian: {
        allowNull: false,
        type: Sequelize.STRING
      },
      unit_kerja: {
        type: Sequelize.ENUM('Umum', 'Teknis', 'IT')
      },
      sertifkat: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('biodata');
  }
};