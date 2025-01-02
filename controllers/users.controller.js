const {Users, Biodata, RiwayatPendidikan, Pendaftar} = require('../models');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS,
  },
});
  
const generateCredentials = () => {
  const username = 'user' + uuidv4().slice(0, 8); // username acak
  const password = 'pass' + uuidv4().slice(0, 8); // password acak
  return { username, password };
};
  
const registerUser = async (req, res) => {
  try {
    const { email, nim, nama, universitas, jurusan } = req.body;
  
    const existingUser = await Pendaftar.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }
  

      const newUser = await Pendaftar.create({
        email,
        nim,
        nama,
        universitas,
        jurusan,
      });
  
      res.status(201).json({ message: 'Pendaftaran berhasil, menunggu persetujuan admin' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Terjadi kesalahan' });
    }
  };

module.exports = { registerUser, generateCredentials, transporter };