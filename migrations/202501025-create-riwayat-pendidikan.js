'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('riwayat_pendidikan', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      id_biodata: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'biodata',
          key: 'id'
        }
      },
      nama_sekolah: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tahun_tamat: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tempat: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('riwayat_pendidikan');
  }
};