'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Biodata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Biodata.belongsTo(models.Users, {
        foreignKey: 'id_users',
        as: 'user',
      });
      Biodata.hasMany(models.RiwayatPendidikan, {
        foreignKey: 'id_biodata',
        as: 'riwayat_pendidikan',
      });
    }
  }
  Biodata.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      id_users: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      nomor_peserta: {
        type: DataTypes.STRING,
        unique: true,
      },
      nama_panggilan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tempat_lahir: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tanggal_lahir: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      anak_ke: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jumlah_saudara: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      IP: {
        type: DataTypes.FLOAT,
      },
      nama_ibu: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pekerjaan_ibu: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nama_ayah: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pekerjaan_ayah: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      agama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      no_hp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alamat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alamat_domisili: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alasan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jadwal_mulai: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      jadwal_selesai: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      keahlian: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      unit_kerja: {
        type: DataTypes.ENUM('Umum', 'Teknis', 'IT'),
      },
      sertifkat: {
        type: DataTypes.STRING,
      },
      foto: {
        type: DataTypes.STRING,
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
      modelName: 'Biodata',
      tableName: 'biodata',
    }
  );
  return Biodata;
};
