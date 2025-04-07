var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const authRoutes = require("./routes/authRoutes");
const tareaRoutes = require("./routes/tareaRoutes");
// Carga las variables de entorno
require('dotenv').config();
const cors = require('cors');
// Configurar CORS
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

var app = express();
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", tareaRoutes);

const PORT = 3005;


app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);



module.exports = app;
