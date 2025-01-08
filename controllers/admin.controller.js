const { v4: uuidv4 } = require('uuid');
const { Pendaftar, Users, Biodata, RiwayatPendidikan, } = require('../models');
const EMAIL_USER = process.env.EMAIL_USER;
const bcrypt = require('bcrypt');
const { transporter } = require('../middlewares/transporter.middleware');
  
const generateCredentials = () => {
  const username = 'user' + uuidv4().slice(0, 8); // username acak
  const password = 'pass' + uuidv4().slice(0, 8); // password acak
  return { username, password };
};

const approveUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const user = await Pendaftar.findByPk(userId);
      if (!user || user.status !== 'pending') {
        return res.status(400).json({ message: 'User tidak ditemukan atau sudah diproses' });
      }
  
      user.status = 'approved';
      await user.save();
      
      // Generate username dan password
      const { username, password } = generateCredentials();
      const hashedPassword = await bcrypt.hash(password, 10);
      // Update status menjadi 'accepted' dan simpan username dan password\
      const createdUser = await Users.create({
        id_pendaftar: user.id,
        username,
        password: hashedPassword,
      });
  
      // Kirim email ke pengguna
      const mailOptions = {
        from: EMAIL_USER,
        to: user.email,
        subject: 'Pendaftaran Diterima',
        text: `Selamat! Akun Anda diterima.\nUsername: ${username}\nPassword: ${password}`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: 'User diterima dan email dikirim' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Terjadi kesalahan' });
    }
  };
  
const rejectUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const user = await Pendaftar.findByPk(userId);
      if (!user || user.status !== 'pending') {
        return res.status(400).json({ message: 'User tidak ditemukan atau sudah diproses' });
      }
  
      // Update status menjadi 'rejected'
      user.status = 'rejected';
      await user.save();
  
      // Kirim email ke pengguna
      const mailOptions = {
        from: EMAIL_USER,
        to: user.email,
        subject: 'Pendaftaran Ditolak',
        text: 'Mohon maaf, pendaftaran Anda ditolak.',
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: 'User ditolak dan email dikirim' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Terjadi kesalahan' });
    }
  };

const tampilPendaftar = async (req, res) => {
    try {
      const users = await Pendaftar.findAll({
        
      });
  
      res.status(200).json({ users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Terjadi kesalahan' });
    }
}

const tampilUsers = async (req, res) => {
    try {
      const users = await Pendaftar.findAll({
        where: {
          status: 'approved'  // Hanya ambil data yang statusnya 'approved'
        },
        include: 
          {
            model: Users,
            as: 'users',
            attributes: ['status', 'id'],
            include: {
              model: Biodata,
              as: 'biodata',
              attributes: ['unit_kerja'],
            }
          },
      });
  
      res.status(200).json({ users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Terjadi kesalahan' });
    }
}
const hapusUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Cari pengguna di tabel Users berdasarkan userId
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Peserta tidak ditemukan' });
    }

    // Hapus data terkait di tabel 'biodata'
    await Biodata.destroy({
      where: { id_users: userId },
    });

    // Hapus data pengguna dari tabel Users
    await Users.destroy({
      where: { id: userId },
    });

    // Jika ingin memperbarui status di tabel Pendaftar
    const pendaftar = await Pendaftar.findOne({
      where: { id: user.id_pendaftar },
    });

    if (pendaftar) {
      pendaftar.status = 'rejected'; // Perbarui status menjadi 'rejected' atau sesuai kebutuhan
      await pendaftar.save();
    }

    res.status(200).json({ message: 'Peserta berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};



const detailUsers = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const user = await Pendaftar.findByPk(userId, {
        where: {
          status: 'approved',  // Hanya ambil data yang statusnya 'approved'
        },
        include: [
          {
            model: Users,
            as: 'users',
            attributes: ['id'],
            include: {
              model: Biodata,
              as: 'biodata',
              include: {
                model: RiwayatPendidikan,
                as: 'riwayat_pendidikan',
              }
            },
          },
        ],
      });
  
      if (!user) {
        return res.status(404).json({ message: 'Pendaftar tidak ditemukan' });
      }

      if(!user.users){
        return res.status(404).json({ message: 'User tidak ditemukan' });
      }

      if(!user.users.biodata){
        return res.status(404).json({ message: 'Biodata tidak ditemukan' });
      }

      if(!user.users.biodata.riwayat_pendidikan){
        return res.status(404).json({ message: 'Riwayat Pendidikan tidak ditemukan' });
      }
  
      res.status(200).json({ user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Terjadi kesalahan' });
    }
  }

  const listBiodata = async (req, res) => {
    try {
      const biodata = await Biodata.findAll({
        
      });
  
      res.status(200).json({ biodata });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Terjadi kesalahan' });
    }
};

const editBiodata = async (req, res) => {
  const { userId } = req.params;
  const { 
    nama_panggilan, tempat_lahir, tanggal_lahir, anak_ke, jumlah_saudara, IP, nama_ibu, pekerjaan_ibu, 
    nama_ayah, pekerjaan_ayah, agama, no_hp, alamat, alamat_domisili, alasan, jadwal_mulai, jadwal_selesai, 
    keahlian, riwayat_pendidikan 
  } = req.body;

  try {
    // Cari biodata berdasarkan userId
    const biodata = await Biodata.findByPk(userId);

    if (!biodata) {
      return res.status(404).json({ message: "Biodata not found for the given user ID" });
    }

    // Update biodata dengan data yang baru
    const updatedBiodata = await biodata.update({
      nama_panggilan,
      tempat_lahir,
      tanggal_lahir,
      anak_ke,
      jumlah_saudara,
      IP,
      nama_ibu,
      pekerjaan_ibu,
      nama_ayah,
      pekerjaan_ayah,
      agama,
      no_hp,
      alamat,
      alamat_domisili,
      alasan,
      jadwal_mulai,
      jadwal_selesai,
      keahlian,
    });

    // Update riwayat pendidikan jika ada
    if (riwayat_pendidikan && riwayat_pendidikan.length > 0) {
      // Hapus riwayat pendidikan lama
      await RiwayatPendidikan.destroy({ where: { id_biodata: biodata.id } });

      // Menambahkan riwayat pendidikan yang baru
      await RiwayatPendidikan.bulkCreate(
        riwayat_pendidikan.map(item => ({
          id_biodata: updatedBiodata.id,
          nama_sekolah: item.nama_sekolah,
          tahun_lulus: item.tahun_lulus,
          tempat: item.tempat,
        }))
      );
    }

    res.status(200).json({ message: "Biodata updated successfully", updatedBiodata });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};


const deleteBiodata = async (req, res) => {
  const { userId } = req.params;

  try {
      // Cari biodata berdasarkan userId
      const biodata = await Biodata.findByPk(userId);

      if (!biodata) {
          return res.status(404).json({ message: "Biodata not found for the given user ID" });
      }

      // Hapus biodata
      await Biodata.destroy({
          where: { id : userId }
      });

      return res.status(200).json({ message: "Biodata deleted successfully" });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error });
  }
};





module.exports = { approveUser, rejectUser,tampilPendaftar, tampilUsers, detailUsers, hapusUser, listBiodata, editBiodata,deleteBiodata };