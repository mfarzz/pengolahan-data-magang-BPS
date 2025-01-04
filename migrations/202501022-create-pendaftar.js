'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pendaftar', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
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