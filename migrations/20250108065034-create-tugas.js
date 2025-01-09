'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tugas', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      judul_tugas: {
        allowNull: false,
        type: Sequelize.STRING
      },
      deskripsi_tugas: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      deadline: {
        allowNull: false,
        type: Sequelize.DATE
      },
      dokumen: {
        allowNull: true, // bisa kosong jika belum ada dokumen
        type: Sequelize.STRING, // untuk menyimpan nama atau path file
      },
      id_user: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_admin: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'admin',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('Belum Selesai', 'Selesai'),
        defaultValue: 'Belum Selesai'
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
    await queryInterface.dropTable('tugas');
  }
};
