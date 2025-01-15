// Importamos Express, la libreria mas famosa que tiene NodeJs para el manejo de base de datos 
// con una gran compatibilidad para la nuestra en concreto, MongoDB.
const express = require('express');
// Importamos Firebase admin, un SDK que nos ofrece las herramientas para el manejo de usuarios
// de nuestro Firebase.
const admin = require('firebase-admin');
// Importamos MongoClient para establecer la conexion con mi cluster en MongoDB.
const { MongoClient } = require('mongodb');
// Importamos cors, vital para la funcionalidad y escalabildad del proyecto en ciertos navegadores,
// que muchos restringen el intercambio de recursos entre diferentes dominios.
const cors = require('cors');
const path = require('path');
// Importamos dotenvm, que carga mi .env contenedor de información sensible del proyecto, 
// si fuera un proyecto real, ocultaria url.env en un git ignore.
require('dotenv').config({ path: './url.env' });
// Inicializamos Firebase Admin con nuestra configuracion, que tambien deberia ser protegida en un proyecto serio.
admin.initializeApp({
  credential: admin.credential.cert(require('./firebase/firebaseServiceAccountKey.json'))
});
// Inicializamos express para poder trabajar con sus funciones.
const app = express();
// Habilitamos CORS para todas las rutas del server.
app.use(cors());
// Aumentamos el límite de tamaño para las solicitudes con el middleware .json y .urlencoded para nuestras solicitudes POST,
// lo necesitaremos para las imagenes de perfil.
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Indicamos la configuración de mi cluster en MongoDB con el parametro almacenado en el .env.
const client = new MongoClient(process.env.MONGO_URL);
// Declaramos una variable vacia y conectamos el Mongo, especificamos la colección y la 
// almacenamos en un variable que manipularemos en nuestras funciones.
let usersCollection;
async function connectDB() {
  await client.connect();
  const db = client.db('Carnetlify');
  usersCollection = db.collection('users');
  console.log('Conectado a MongoDB');
}
// Cazamos possibles errores.
connectDB().catch(console.error);
// Función para verificar los tokens de Firebase, se ejecutara antes que cualquier función del servidor, 
// es recibido en la cabecera de las solicitudes y es validado por Firebase Admin, en caso de error te echara.
async function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    // Guardamos el usuario en el req para su manipulación posterior.
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).send('Token no válido');
  }
}
// Ruta para registrar usuarios en MongoDB, despues de verificar el token.
app.post('/register', verifyToken, async (req, res) => {
  // Sacamos el uid del usuario actual por el token que revisamos anteriormente.
  const userId = req.user.uid;
  // Creamos un objeto con los datos del usuario.
  const userData = req.body;
  // Verificamos si el usuario ya existe en la base de datos.
  const existingUser = await usersCollection.findOne({ userId });
  // Si el usuario no existe, lo creamos.
  if (!existingUser) {
    await usersCollection.insertOne({ userId, ...userData });
  } else if (existingUser) {
    // Si existe lo notificamos.
    console.log("Ya existes en MongoDB")
  }
  res.status(201).send('Usuario registrado');
});
// Ruta para sacar el nombre de usuario en MongoDB
app.post('/users/info', verifyToken, async (req, res) => {
  // Guardamos el valor de UserId proporcionado en el cuerpo de la solicitud.
  const { userId } = req.body;
  // Comprovación previa.
  if (!userId) {
    return res.status(400).send({ error: 'El userId es requerido.' });
  }
  // Buscamos y guardamos los datos del usuario almacenado en Mongo.
  try {
    const user = await usersCollection.findOne({ userId });
    if (!user) {
      return res.status(404).send({ error: 'Usuario no encontrado.' });
    }
    res.status(200).send(user);
  } catch (error) {
    console.error('Error al buscar el usuario:', error);
    res.status(500).send({ error: 'Error interno del servidor.' });
  }
});
// Ruta para desbloquear un usuario en MongoDB
app.post('/users/block', verifyToken, async (req, res) => {
  const userId = req.user.uid;
  const existingUser = await usersCollection.findOne({ userId });
  if (existingUser) {
    // Si el usuario existe, actualizamos su estado de bloqueo.
    await usersCollection.updateOne({ userId }, { $set: { isLocked: "false" } }, { $unset: { isLocked: "true" } });
    console.log("Si se ha encontrado el usuario");
  } else {
    console.log("No se ha encontrado el usuario");
  }
  res.status(201).send('Estado del usuario actualizado');
});
// Ruta para actualizar nombre usuarios en MongoDB
app.post('/updateNameUser', verifyToken, async (req, res) => {
  const userId = req.user.uid;
  // Agarramos el valor de fullName del cuerpo de la solicitud.
  const { fullName } = req.body;
  try {
    const existingUser = await usersCollection.findOne({ userId });
    if (existingUser) {
      // Actualizar el campo fullName.
      await usersCollection.updateOne({ userId }, { $set: { fullName } }
      );
      console.log("Usuario encontrado y actualizado.");
      res.status(200).send(`Usuario actualizado en Mongo con fullName = ${fullName}`);
    } else {
      console.log("No se ha encontrado el usuario.");
      res.status(404).send("Usuario no encontrado.");
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).send("Error interno del servidor.");
  }
});
// Ruta para actualizar el email de un usuario en MongoDB
app.post('/updateEmailUser', verifyToken, async (req, res) => {
  const userId = req.user.uid;
  const { email } = req.body;
  try {
    const existingUser = await usersCollection.findOne({ userId });
    if (existingUser) {
      // Actualizar el campo email.
      await usersCollection.updateOne({ userId }, { $set: { email } });
      console.log("Usuario encontrado y actualizado.");
      res.status(200).send(`Usuario actualizado en Mongo con fullName = ${email}`);
    } else {
      console.log("No se ha encontrado el usuario.");
      res.status(404).send("Usuario no encontrado.");
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).send("Error interno del servidor.");
  }
});
// Ruta para actualizar el url de la imagen de perfil de un usuario en MongoDB
app.post('/updatePhotoURLUser', verifyToken, async (req, res) => {
  const userId = req.user.uid;
  const { profile_img } = req.body;
  try {
    const existingUser = await usersCollection.findOne({ userId });
    if (existingUser) {
      // Actualizar el campo profile_img.
      await usersCollection.updateOne({ userId }, { $set: { profile_img } });
      console.log("Usuario encontrado y actualizado.");
      res.status(200).send(`Usuario actualizado en Mongo con fullName = ${profile_img}`);
    } else {
      console.log("No se ha encontrado el usuario.");
      res.status(404).send("Usuario no encontrado.");
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).send("Error interno del servidor.");
  }
});
// Ruta para actualizar el dni de un usuario en MongoDB
app.post('/updateDniUser', verifyToken, async (req, res) => {
  const userId = req.user.uid;
  const { dni } = req.body;
  try {
    const existingUser = await usersCollection.findOne({ userId });
    if (existingUser) {
      // Actualizar el campo Dni.
      await usersCollection.updateOne({ userId }, { $set: { dni } });
      console.log("Usuario encontrado y actualizado.");
      res.status(200).send(`Usuario actualizado en Mongo con fullName = ${dni}`);
    } else {
      console.log("No se ha encontrado el usuario.");
      res.status(404).send("Usuario no encontrado.");
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).send("Error interno del servidor.");
  }
});
// Ruta para actualizar la edad de un usuario en MongoDB
app.post('/updateAgeUser', verifyToken, async (req, res) => {
  const userId = req.user.uid;
  const { age } = req.body;
  try {
    const existingUser = await usersCollection.findOne({ userId });
    if (existingUser) {
      // Actualizar el campo Edad.
      await usersCollection.updateOne({ userId }, { $set: { age } });

      console.log("Usuario encontrado y actualizado.");
      res.status(200).send(`Usuario actualizado en Mongo con fullName = ${age}`);
    } else {
      console.log("No se ha encontrado el usuario.");
      res.status(404).send("Usuario no encontrado.");
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).send("Error interno del servidor.");
  }
});
// Ruta para actualizar la pais de un usuario en MongoDB
app.post('/updateCountryUser', verifyToken, async (req, res) => {
  const userId = req.user.uid;
  const { country } = req.body;
  try {
    const existingUser = await usersCollection.findOne({ userId });
    // Actualizar el campo pais.
    if (existingUser) {
      await usersCollection.updateOne({ userId }, { $set: { country } });
      console.log("Usuario encontrado y actualizado.");
      res.status(200).send(`Usuario actualizado en Mongo con fullName = ${country}`);
    } else {
      console.log("No se ha encontrado el usuario.");
      res.status(404).send("Usuario no encontrado.");
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).send("Error interno del servidor.");
  }
});
// Ruta para actualizar la provincia de un usuario en MongoDB
app.post('/updateProvinceUser', verifyToken, async (req, res) => {
  const userId = req.user.uid;
  const { province } = req.body;
  try {
    const existingUser = await usersCollection.findOne({ userId });
    if (existingUser) {
    // Actualizar el campo pais.
      await usersCollection.updateOne({ userId }, { $set: { province } });
      console.log("Usuario encontrado y actualizado.");
      res.status(200).send(`Usuario actualizado en Mongo con fullName = ${province}`);
    } else {
      console.log("No se ha encontrado el usuario.");
      res.status(404).send("Usuario no encontrado.");
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).send("Error interno del servidor.");
  }
});
// Ruta para actualizar la ciudad de un usuario en MongoDB
app.post('/updateCityUser', verifyToken, async (req, res) => {
  const userId = req.user.uid;
  const { city } = req.body;
  try {
    const existingUser = await usersCollection.findOne({ userId });
    if (existingUser) {
      // Actualizar el campo pais.
      await usersCollection.updateOne({ userId },{ $set: { city } });

      console.log("Usuario encontrado y actualizado.");
      res.status(200).send(`Usuario actualizado en Mongo con fullName = ${city}`);
    } else {
      console.log("No se ha encontrado el usuario.");
      res.status(404).send("Usuario no encontrado.");
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).send("Error interno del servidor.");
  }
});
// Ruta para actualizar la codigo postal de un usuario en MongoDB
app.post('/updatePostalCodeUser', verifyToken, async (req, res) => {
  const userId = req.user.uid;
  const { postalCode } = req.body;
  try {
    const existingUser = await usersCollection.findOne({ userId });
    if (existingUser) {
      // Actualizar el campo codigo postal.
      await usersCollection.updateOne({ userId }, { $set: { postalCode } });
      console.log("Usuario encontrado y actualizado.");
      res.status(200).send(`Usuario actualizado en Mongo con fullName = ${postalCode}`);
    } else {
      console.log("No se ha encontrado el usuario.");
      res.status(404).send("Usuario no encontrado.");
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).send("Error interno del servidor.");
  }
});
// Ruta para actualizar la casa de un usuario en MongoDB
app.post('/updateHomeUser', verifyToken, async (req, res) => {
  const userId = req.user.uid;
  const { home } = req.body;
  try {
    const existingUser = await usersCollection.findOne({ userId });
    if (existingUser) {
      // Actualizar el campo home.
      await usersCollection.updateOne({ userId }, { $set: { home } });
      console.log("Usuario encontrado y actualizado.");
      res.status(200).send(`Usuario actualizado en Mongo con fullName = ${home}`);
    } else {
      console.log("No se ha encontrado el usuario.");
      res.status(404).send("Usuario no encontrado.");
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).send("Error interno del servidor.");
  }
});
// Ruta para actualizar el telefono de un usuario en MongoDB
app.post('/updatePhoneUser', verifyToken, async (req, res) => {
  const userId = req.user.uid;
  const { phone } = req.body;
  try {
    const existingUser = await usersCollection.findOne({ userId });
    if (existingUser) {
      // Actualizar el campo telefono.
      await usersCollection.updateOne({ userId }, { $set: { phone } });
      console.log("Usuario encontrado y actualizado.");
      res.status(200).send(`Usuario actualizado en Mongo con fullName = ${phone}`);
    } else {
      console.log("No se ha encontrado el usuario.");
      res.status(404).send("Usuario no encontrado.");
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).send("Error interno del servidor.");
  }
});
// Ruta para actualizar la imagen de perfil
app.post('/updateProfileImage', verifyToken, async (req, res) => {
  const userId = req.user.uid;
  const { profile_img } = req.body;
  try {
    const result = await usersCollection.updateOne({ userId },{ $set: { profile_img } });
    if (result.matchedCount === 0) {
      return res.status(404).send({ error: 'Usuario no encontrado.' });
    }
    res.status(200).send({ message: 'Imagen de perfil actualizada correctamente.' });
  } catch (error) {
    console.error('Error al actualizar la imagen de perfil:', error);
    res.status(500).send({ error: 'Error interno del servidor.' });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
