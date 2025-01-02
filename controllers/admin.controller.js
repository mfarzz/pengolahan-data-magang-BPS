const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const { Pendaftar, Users } = require('../models');
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER, 
    pass: EMAIL_PASS,
  },
});
  
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
  
      // Update status menjadi 'accepted' dan simpan username dan password\
      const createdUser = await Users.create({
        id_pendaftar: user.id,
        username,
        password,
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

  
  
  module.exports = { approveUser, rejectUser };