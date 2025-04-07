const jwt = require("jsonwebtoken");
const { Tarea, Usuario } = require("../models");

// listar todas las tareas
exports.obtenerTareas = async (req, res) => {
  // Extraemos el token del header de autorización
  const token = req.headers.authorization?.split(" ")[1];
  // Si no hay token, se deniega el acceso
  if (!token) return res.status(401).json({ message: "Acceso denegado, token requerido" });
  try {
    // Verificamos y decodificamos el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Buscamos el usuario en la base de datos por su ID
    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario) return res.status(404).json({ message: "Usuario no autorizado" });
    const tareas = await Tarea.findAll({
          where: { usuarioId: usuario.id },
    });
    if (!tareas) return res.status(200).json({ message: "Tareas no encontradas para el usuario" });
    res.status(200).json(tareas);
  } catch (error) {
    // En caso de error, informamos que el token es inválido o ha expirado
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};
// registrar tarea
exports.registrarTarea = async (req, res) => {
    const { titulo, descripcion, fechaLimite } = req.body;
    // Extraemos el token del header de autorización
    const token = req.headers.authorization?.split(" ")[1];
    // Si no hay token, se deniega el acceso
    if (!token) return res.status(401).json({ message: "Acceso denegado, token requerido" });
    try {
        // Verificamos y decodificamos el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Buscamos el usuario en la base de datos por su ID
        const usuario = await Usuario.findByPk(decoded.id);
        if (!usuario) return res.status(404).json({ message: "Usuario no autorizado" });
        // Guardar tarea en la "base de datos"
        const nuevaTarea = {
            titulo,
            descripcion,
            estado:0,
            fechaLimite,
            usuarioId:usuario.id
        };
        const tarea = await Tarea.create(nuevaTarea);
        res.status(201).json(tarea);
        
    } catch (error) {
        // En caso de error, informamos que el token es inválido o ha expirado
        res.status(401).json({ message: "Token inválido o expirado" });
    }
};

// Obtener tarea de usuario por id
exports.obtenerTarea = async (req, res) => {
    // Extraemos el token del header de autorización
    const token = req.headers.authorization?.split(" ")[1];
    // Si no hay token, se deniega el acceso
    if (!token) return res.status(401).json({ message: "Acceso denegado, token requerido" });
    try {
        // Verificamos y decodificamos el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Buscamos el usuario en la base de datos por su ID
        const usuario = await Usuario.findByPk(decoded.id);
        if (!usuario) return res.status(404).json({ message: "Usuario no autorizado" });
        // recuperamos el id de la tarea
        const id = req.params.id;
        const tareas = await Tarea.findAll({
            where: { usuarioId: usuario.id, id: id},
        });
        if (!tareas) return res.status(200).json({ message: "Tareas no encontradas para el usuario" });
        res.status(200).json(tareas);
    } catch (error) {
        // En caso de error, informamos que el token es inválido o ha expirado
        res.status(401).json({ message: "Token inválido o expirado" });
    }
};
// eliminar tarea por id solo se puede eliminar tareas en estado 2 completada
exports.eliminarTarea = async (req, res) => {
    // Extraemos el token del header de autorización
    const token = req.headers.authorization?.split(" ")[1];
    // Si no hay token, se deniega el acceso
    if (!token) return res.status(401).json({ message: "Acceso denegado, token requerido" });
    try {
        // Verificamos y decodificamos el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Buscamos el usuario en la base de datos por su ID
        const usuario = await Usuario.findByPk(decoded.id);
        if (!usuario) return res.status(404).json({ message: "Usuario no autorizado" });
        // recuperamos el id de la tarea
        const idTarea = req.params.id;
        const tarea = await Tarea.findOne({
            where: { usuarioId: usuario.id, id: idTarea },
        });
        if (!tarea) return res.status(200).json({ message: "Tareas no encontradas para el usuario" });
        if (tarea.estado == 0) return res.status(200).json({ message: "No se pueden eliminar tarea en estado pendiente" });
        if (tarea.estado == 1) return res.status(200).json({ message: "No se pueden eliminar tarea en estado proceso" });
        await tarea.destroy();
        res.status(200).json({ message: "Tarea eliminada" });
    } catch (error) {
        // En caso de error, informamos que el token es inválido o ha expirado
        res.status(401).json({ message: "Token inválido o expirado" });
    }
};
// actualizar tarea por id 0 --> 1 --> 2
exports.actualizarTarea = async (req, res) => {
    // Extraemos el token del header de autorización
    const token = req.headers.authorization?.split(" ")[1];
    // Si no hay token, se deniega el acceso
    if (!token) return res.status(401).json({ message: "Acceso denegado, token requerido" });
    try {
        // Verificamos y decodificamos el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Buscamos el usuario en la base de datos por su ID
        const usuario = await Usuario.findByPk(decoded.id);
        if (!usuario) return res.status(404).json({ message: "Usuario no autorizado" });
        // recuperamos el id de la tarea
        const idTarea = req.params.id;
        const tarea = await Tarea.findOne({
            where: { usuarioId: usuario.id, id: idTarea },
        });
        if (tarea.estado == 2) return res.status(200).json({ message: "No se pueden actualizar tarea en estado completado" });
        if (tarea.estado == 0 && req.body.estado == 1) {
            await tarea.update(req.body);
            return res.status(200).json(tarea);
        }
        if (tarea.estado == 1 && req.body.estado == 2) {
            await tarea.update(req.body);
            return res.status(200).json(tarea);
        }
        const { titulo, descripcion, fechaLimite } = req.body;
        const actualizarTarea = {
            titulo:titulo,
            descripcion:descripcion,
            estado: tarea.estado,
            fechaLimite: fechaLimite,
            usuarioId: tarea.usuarioId,
        };
        await tarea.update(actualizarTarea);
        return res.status(200).json(actualizarTarea);
    } catch (error) {
        // En caso de error, informamos que el token es inválido o ha expirado
        res.status(401).json({ message: "Token inválido o expirado" });
    }   
};
