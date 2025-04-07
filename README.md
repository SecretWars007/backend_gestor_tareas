# backend_gestor_tareas
Proyecto Final de la maestría fullstack de la UCB - Backend - Gestor de Tareas - PostgreSQL
# pasos para crear el backend
1 - instalar global     -- npm install -g express-generator sequelize-cli
2 - crear proyecto      -- express backend_gestor_tareas --no-view
3 - instalar            -- npm install
4 - instalar sequelize  -- npm install sequelize
5 - instalar postgresql -- npm install pg pg-hstore
6 - estructura sequelize-- npx sequelize-cli init
7 - crear modelo usuario-- npx sequelize-cli model:generate --name Usuario --attributes nombre:string,correo:string,password:string
8 - instalar jwt        -- npm install jsonwebtoken
9 - instalar dotenv     -- npm install dotenv
10- instalar bcryptjs   -- npm install bcryptjs
11- crear modelo tareas -- npx sequelize-cli model:generate --name Tarea --attributes titulo:string,descripcion:string,estado:integer,fechaLimite:date,usuarioId:integer