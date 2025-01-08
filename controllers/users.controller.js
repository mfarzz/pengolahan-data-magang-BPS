const { Pendaftar, Users, Biodata, RiwayatPendidikan, Otp} = require('../models');
const EMAIL_USER = process.env.EMAIL_USER;
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const { transporter } = require('../middlewares/transporter.middleware');
const fs = require('fs');
const path = require('path');

const sendOtp = async (req, res) => {
    const userId = req.user.id
    try {
        const user = await Users.findByPk(userId, {
            include: {
                model: Pendaftar, // Include the Pendaftar model
                as: 'pendaftar', // Use the alias defined in the association
                attributes: ['email'] // Only get the email field
            }
        });

        if (!user) {
            return res.status(404).json({ message: "Pengguna atau Pendaftar tidak ditemukan" });
        }

        const otpCode = crypto.randomInt(100000, 999999).toString();

        await Otp.create({
            id_users: userId,
            kode: otpCode,
            expiredAt: new Date(Date.now() + 5 * 60 * 1000), // Kadaluarsa dalam 5 menit
        });

        await transporter.sendMail({
            from: EMAIL_USER,
            to: user.pendaftar.email,
            subject: "Kode OTP untuk Ubah Password",
            text: `Kode OTP Anda adalah: ${otpCode}`,
            });

        res.status(200).json({ 
            message: "Kode OTP telah dikirim ke email Anda",
            expiresIn: "5 minutes"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan' });
    }
}

const resetPassword = async (req, res) => {
    const { otpCode, newPassword } = req.body;
    const userId = req.user.id;
  
    try {
      // Gabungkan 6 angka OTP menjadi satu string
      const otpString = otpCode.join('');
  
      // Cari user berdasarkan email
      const user = await Users.findByPk(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Cari OTP terkait
      const otp = await Otp.findOne({
        where: {
          id_users: userId,
          kode: otpString,
          status: false,
        },
      });
  
      // Validasi OTP
      if (!otp || otp.expiredAt < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
  
      // Hash password baru
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update password user
      await user.update({ password: hashedPassword });
  
      // Tandai OTP sebagai digunakan
      await otp.update({ status: true });
  
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error });
    }
}

const tampilFormBiodata = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await Users.findByPk(userId, {
            include: {
                model: Pendaftar,
                as: 'pendaftar',
                attributes: ['universitas', 'jurusan', 'nama', 'nim']
            }
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        if (!user.pendaftar) {
            return res.status(400).json({ message: "Pendaftar not found" });
        }
        
        res.status(200).json({ message: "Form biodata", data: user.pendaftar });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

const addBiodata = async (req, res) => {
    const userId = req.user.id;
    const { nama_panggilan, tempat_lahir, tanggal_lahir, anak_ke, jumlah_saudara, IP, nama_ibu, pekerjaan_ibu, nama_ayah, 
        pekerjaan_ayah, agama, no_hp, alamat, alamat_domisili, alasan, jadwal_mulai, jadwal_selesai, keahlian, riwayat_pendidikan } = req.body;

    try {
        const user = await Users.findByPk(userId, {
            include: {
                model: Biodata,
                as: 'biodata',
                include: {
                    model: RiwayatPendidikan,
                    as: 'riwayat_pendidikan'
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.biodata && user.biodata.foto !== null) {   
            return res.status(400).json({ message: "Biodata already exists for this user" });
        }

        if (!user.biodata) {
            // Validate the number of educational history records
            if (riwayat_pendidikan && (riwayat_pendidikan.length < 1 || riwayat_pendidikan.length > 3)) {
                return res.status(400).json({ message: "The number of educational records must be between 1 and 3." });
            }

            let foto;
            if (req.file) {
                const allowedMimeTypes = ['image/jpeg', 'image/png']; // Jenis file yang diizinkan
                const maxFileSize = 50 * 1024; // Ukuran maksimal (50 KB)
    
                // Validasi jenis file
                if (!allowedMimeTypes.includes(req.file.mimetype)) {
                    return res.status(400).json({ message: "Invalid file type. Only JPEG and PNG are allowed." });
                }
    
                // Validasi ukuran file
                if (req.file.size > maxFileSize) {
                    return res.status(400).json({ message: "File size exceeds the maximum limit of 50 KB." });
                }
    
                const directory = `uploads/users/${userId}`;
                // Ensure the directory exists
                if (!fs.existsSync(directory)) {
                    fs.mkdirSync(directory, { recursive: true });
                }
    
                // Set the file path
                foto = path.join(directory, req.file.filename);
    
                // Move the file to the user's directory
                fs.renameSync(req.file.path, foto);
            }

            // Generate nomor peserta
            const lastBiodata = await Biodata.findOne({
                order: [['nomor_peserta', 'DESC']]
            });

            let nomorPeserta = '001'; // Default nomor peserta jika belum ada data
            if (lastBiodata && lastBiodata.nomor_peserta) {
                const lastNumber = parseInt(lastBiodata.nomor_peserta, 10);
                if (!isNaN(lastNumber)) {
                    nomorPeserta = String(lastNumber + 1).padStart(3, '0'); // Increment and pad to 3 digits
                }
            }

            // Create biodata
            const biodata = await Biodata.create({
                id_users: userId,
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
                foto,
                nomor_peserta: nomorPeserta, // Simpan nomor peserta
            });

            // Bulk create educational history if provided
            if (riwayat_pendidikan) {
                await RiwayatPendidikan.bulkCreate(
                    riwayat_pendidikan.map(item => ({
                        id_biodata: biodata.id,
                        nama_sekolah: item.nama_sekolah,
                        tahun_lulus: item.tahun_lulus,
                        tempat: item.tempat
                    }))
                );
            }

            return res.status(201).json({ message: "Biodata created successfully", nomor_peserta: nomorPeserta });
        }
        
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
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




module.exports = { sendOtp, resetPassword, addBiodata, tampilFormBiodata, editBiodata };