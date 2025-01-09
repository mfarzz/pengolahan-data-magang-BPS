'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tugas extends Model {
    static associate(models) {
      // Perbaiki relasi ke tabel Users - sesuaikan dengan nama model yang benar
      Tugas.belongsTo(models.Users, {  // Ubah dari models.Users ke models.User (singular)
        foreignKey: 'id_user',
        as: 'users',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });

      Tugas.belongsTo(models.Admin, {
        foreignKey: 'id_admin',
        as: 'admin',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }

  Tugas.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      judul_tugas: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deskripsi_tugas: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dokumen: {
        type: DataTypes.STRING,  // Menyimpan nama atau path file
        allowNull: true,  // Kolom ini boleh kosong jika dokumen belum diunggah
      },
      id_user: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',  // Ini sudah benar karena merujuk ke nama tabel
          key: 'id',
        },
      },
      id_admin: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {  // Tambahkan references untuk id_admin
          model: 'admin',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM('Belum Selesai', 'Selesai'),
        defaultValue: 'Belum Selesai',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Tugas',
      tableName: 'tugas',
      timestamps: true,
    }
  );

  return Tugas;
};