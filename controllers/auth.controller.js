const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {Users, Admin, Pendaftar} = require("../models");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
      let user = null;

      // Cek apakah username ada pada tabel admin
      user = await Admin.findOne({ where: { username } });

      // Jika tidak ditemukan di admin, coba cari di tabel users
      if (!user) {
          user = await Users.findOne({ where: { username, status: "Aktif" } });
      }

      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      // Verifikasi password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
      }

      // Membuat token akses dan refresh token
      const accessToken = jwt.sign(
          {
              id: user.id,
              username: user.username,
              role: user.role, 
          },
          JWT_SECRET,
          { expiresIn: "1d" }
      );

      const refreshToken = jwt.sign(
          {
              id: user.id,
              username: user.username,
              role: user.role, 
          },
          JWT_SECRET,
          { expiresIn: "7d" }
      );

      res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: "Strict",
      });

      res.json({
          message: "Login successful",
          accessToken,
      });
  } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({
          error: "Error logging in",
          details: error.message || "An unexpected error occurred",
      });
  }
};

// Refresh token
const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Ambil refresh token dari cookie

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required" });
  }

  try {
    // Verifikasi refresh token
    jwt.verify(refreshToken, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired refresh token" });
      }

      // Jika refresh token valid, buat access token baru
      const newAccessToken = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role, 
        },
        JWT_SECRET,
        { expiresIn: "1d" } // Access token berlaku 1 jam
      );

      res.json({ accessToken: newAccessToken });
    });

  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.status(500).json({
      error: "Error refreshing access token",
      details: error.message || "An unexpected error occurred",
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { email, nim, nama, universitas, jurusan } = req.body;
  
    const existingUser = await Pendaftar.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }
  
      const newUser = await Pendaftar.create({
        id_admin: 1,
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

const logout = async (req, res) => {
  try {
      // Hapus refresh token dari cookie
      res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict"
      });

      res.status(200).json({
          message: "Logout successful"
      });
  } catch (error) {
      console.error("Logout Error:", error);
      res.status(500).json({
          error: "Error during logout",
          details: error.message || "An unexpected error occurred"
      });
  }
};

module.exports = { login, refreshAccessToken, registerUser, logout };
