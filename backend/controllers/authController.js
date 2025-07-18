const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { generateToken } = require('../utils/tokenUtils');

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID
);

// REGISTRO
exports.register = async (req, res) => {
  try {
    const { nombre, apellido, email, password, confirmPassword, role, code } = req.body;

    if (password !== confirmPassword)
      return res.status(400).json({ msg: 'Las contraseñas no coinciden' });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: 'El email ya está registrado' });

    // Validación de código especial
    if ((role === 'Tecnico' || role === 'Delegado') && code !== process.env.CODIGO_ESPECIAL) {
      return res.status(400).json({ msg: 'Código especial inválido' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      role: role || 'Deportista',
      verificationToken,
    });

    await newUser.save();

    const verifyLink = `${process.env.CLIENT_URL}/verify/${verificationToken}`;

    await sendEmail(email, 'Verifica tu cuenta', `
      <h2>Bienvenido ${nombre}</h2>
      <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
      <a href="${verifyLink}">Verificar cuenta</a>
    `);

    res.status(201).json({ msg: 'Usuario registrado. Verifica tu email.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// VERIFICACIÓN EMAIL
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) return res.status(400).json({ msg: 'Token inválido' });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ msg: 'Cuenta verificada correctamente' });
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

    if (!user.isVerified) return res.status(400).json({ msg: 'Verifica tu email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const token = generateToken({ id: user._id, role: user.role });

    res.json({
      token,
      user: {
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// LOGIN GOOGLE
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const {
      email,
      given_name: nombre,
      family_name: apellido,
      sub: googleId,
      picture,
    } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        nombre,
        apellido,
        email,
        googleId,
        isVerified: true,
        role: 'Deportista',
        picture,
      });
      await user.save();
    }

    const token = generateToken({ id: user._id, role: user.role });

    res.json({
      token,
      user: {
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        role: user.role,
        google: true,
        picture,
      },
    });
  } catch (err) {
    console.error('Error interno Google Login:', err);
    res.status(500).json({ msg: 'Error en Google Login' });
  }
};

