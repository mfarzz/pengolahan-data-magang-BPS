'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RiwayatPendidikan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RiwayatPendidikan.belongsTo(models.Biodata, {
        foreignKey: 'id_biodata',
        as: 'biodata',
      });
    }
  }
  RiwayatPendidikan.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      id_biodata: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'biodata',
          key: 'id',
        },
      },
      nama_sekolah: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tahun_tamat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tempat: {
        type: DataTypes.STRING,
        allowNull: false,
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
      modelName: 'RiwayatPendidikan',
      tableName: 'riwayat_pendidikan',
    }
  );
  return RiwayatPendidikan;
};
