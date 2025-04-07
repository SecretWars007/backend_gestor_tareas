const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models"); 

// crear usuario
exports.register = async (req, res) => {
  const { nombre, correo, password } = req.body;
  const usuario = await Usuario.findOne({
    where: { correo: correo },
  });
  if (usuario) {
    return res.status(400).json({ message: "El usuario ya está registrado" });
  }
  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);
  // Guardar usuario en la "base de datos"
  const nuevoUsuario = {
    nombre,
    correo,
    password: hashedPassword,
  };
  const usuario_registrado = await Usuario.create(nuevoUsuario);
  res.status(201).json(usuario_registrado);
};

// informacion usuario autenticado
exports.me = async (req, res) => {
  // Extraemos el token del header de autorización
  const token = req.headers.authorization?.split(" ")[1];
  // Si no hay token, se deniega el acceso
  if (!token) return res.status(401).json({ message: "Acceso denegado, token requerido" });
  try {
    // Verificamos y decodificamos el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Buscamos el usuario en la base de datos por su ID
    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json({ id: usuario.id, nombre: usuario.nombre, correo: usuario.correo  });
  } catch (error) {
    // En caso de error, informamos que el token es inválido o ha expirado
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// autenticar usuario
exports.login = async (req, res) => {
  const { correo, password } = req.body;
  const usuario = await Usuario.findOne({
    where: { correo: correo },
  });
  // verificamos el registro del usuario
  if (!usuario) {
    return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
  }
  // validamos el password del usuario
  const isMatch = await bcrypt.compare(password, usuario.password);
  // verificamos si el password del usuario esta correcto 
  if (!isMatch) {
    return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
  }
  // Crear un token JWT
  const token = jwt.sign(
    { id: usuario.id, nombre: usuario.nombre },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );
  // retornamos el token
  res.status(200).json(token);
};


