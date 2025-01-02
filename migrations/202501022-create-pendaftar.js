'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pendaftar', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_admin: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'admin',
          key: 'id'
        }
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      nim:  {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      nama: {
        allowNull: false,
        type: Sequelize.STRING
      },
      universitas: {
        allowNull: false,
        type: Sequelize.STRING
      },
      jurusan: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
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
    await queryInterface.dropTable('pendaftar');
  }
};