'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pendaftar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pendaftar.belongsTo(models.Admin, {
        foreignKey: 'id_admin',
        as: 'admin',
      });
      Pendaftar.hasOne(models.Users, {
        foreignKey: 'id_pendaftar',
        as: 'users',
      });
    }
  }
  Pendaftar.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_admin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'admin',
          key: 'id',
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      nim: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      universitas: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jurusan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Pendaftar',
      tableName: 'pendaftar',
    }
  );
  return Pendaftar;
};
