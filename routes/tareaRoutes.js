const express = require("express");
const router = express.Router();
const { obtenerTareas, registrarTarea, obtenerTarea, eliminarTarea, actualizarTarea } = require("../controller/tareaController");

// obtener todas las tareas
router.get("/", obtenerTareas);
// registrar tarea
router.post("/", registrarTarea);
// obtener tarea por id
router.get("/:id", obtenerTarea);
// eliminar tarea por id
router.delete("/:id", eliminarTarea);
// actualizar tarea por id
router.put("/:id", actualizarTarea);
module.exports = router;