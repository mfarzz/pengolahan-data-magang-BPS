'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.belongsTo(models.Pendaftar, {
        foreignKey: 'id_pendaftar',
        as: 'pendaftar',
      });
      Users.hasOne(models.Biodata, {
        foreignKey: 'id_users',
        as: 'biodata',
      });
      Users.hasMany(models.Otp, {
        foreignKey: 'id_users',
        as: 'otp' 
      })
      Users.hasMany(models.Tugas, {
        foreignKey: 'id_user',
        as: 'tugas' 
      })
    }
  }
  Users.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      id_pendaftar: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'pendaftar',
          key: 'id',
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
      },
      status: {
        type: DataTypes.ENUM('Aktif', 'Selesai'),
        allowNull: false,
        defaultValue: 'Aktif'
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
      modelName: 'Users',
      tableName: 'users',
    }
  );
  return Users;
};
