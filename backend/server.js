const express = require('express');
const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Importa cors
require('dotenv').config({ path: './url.env' });

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(require('./firebase/firebaseServiceAccountKey.json'))
});

const app = express();

// Habilita CORS para todas las rutas
app.use(cors());

app.use(express.json());

// Conexión a MongoDB
const client = new MongoClient(process.env.MONGO_URL);
let usersCollection;

async function connectDB() {
  await client.connect();
  const db = client.db('Carnetlify');
  usersCollection = db.collection('users');
  console.log('Conectado a MongoDB');
}

connectDB().catch(console.error);

// Middleware para verificar token de Firebase
async function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).send('Token no válido');
  }
}

// Ruta para registrar usuarios en MongoDB
app.post('/register', verifyToken, async (req, res) => {
  const userId = req.user.uid;
  const userData = req.body;

  const existingUser = await usersCollection.findOne({ userId });
  if (!existingUser) {
    await usersCollection.insertOne({ userId, ...userData });
  }  else if (existingUser){
    /* await usersCollection.replaceOne({userId}, {userId, ...userData }); */
    console.log("Ya existe una cuenta")
  } 
  res.status(201).send('Usuario registrado');
  console.log(req);
});

// Ruta para sacar el nombre de usuario en MongoDB
app.post('/users/info', verifyToken, async (req, res) => {
  const { userId } = req.body; // Asegúrate de que el body contiene userId

  if (!userId) {
    return res.status(400).send({ error: 'El userId es requerido.' });
  }

  try {
    // Buscar el usuario por userId
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

 app.post('/users/block', verifyToken, async (req, res) => {
  const userId = req.user.uid;
  const userData = req.body;

  const existingUser = await usersCollection.findOne({ userId });
  if (existingUser) {
    await usersCollection.updateOne({userId}, {$set: {isLocked: "false"}}, {$unset: {isLocked: "true"}} );
    console.log("Si se ha encontrado el usuario");
  } else{
    console.log("No se ha encontrado el usuario");
  }
  res.status(201).send('Usuario actualizado en Mongo = ' + userData);
});

// Ruta para actualizar nombre usuarios en MongoDB
app.post('/updateNameUser', verifyToken, async (req, res) => {
  const userId = req.user.uid; // Obtener el ID del usuario autenticado
  const { fullName } = req.body; // Obtener fullName del cuerpo de la solicitud

  try {
    // Buscar si existe el usuario
    const existingUser = await usersCollection.findOne({ userId });

    if (existingUser) {
      // Actualizar el campo fullName
      await usersCollection.updateOne(
        { userId },
        { $set: { fullName } } // Actualiza el campo fullName
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

app.post('/updateDniUser', verifyToken, async (req, res) => {
  const userId = req.user.uid; 
  const { dni } = req.body; 

  try {

    const existingUser = await usersCollection.findOne({ userId });

    if (existingUser) {

      await usersCollection.updateOne(
        { userId },
        { $set: { dni } }
      );

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

app.post('/updateAgeUser', verifyToken, async (req, res) => {
  const userId = req.user.uid; 
  const { age } = req.body; 

  try {

    const existingUser = await usersCollection.findOne({ userId });

    if (existingUser) {

      await usersCollection.updateOne(
        { userId },
        { $set: { age } }
      );

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

app.post('/updateCountryUser', verifyToken, async (req, res) => {
  const userId = req.user.uid; 
  const { country } = req.body; 

  try {

    const existingUser = await usersCollection.findOne({ userId });

    if (existingUser) {

      await usersCollection.updateOne(
        { userId },
        { $set: { country } }
      );

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

app.post('/updateProvinceUser', verifyToken, async (req, res) => {
  const userId = req.user.uid; 
  const { province } = req.body; 

  try {

    const existingUser = await usersCollection.findOne({ userId });

    if (existingUser) {

      await usersCollection.updateOne(
        { userId },
        { $set: { province } }
      );

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

app.post('/updateCityUser', verifyToken, async (req, res) => {
  const userId = req.user.uid; 
  const { city } = req.body; 

  try {

    const existingUser = await usersCollection.findOne({ userId });

    if (existingUser) {

      await usersCollection.updateOne(
        { userId },
        { $set: { city } }
      );

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

app.post('/updatePostalCodeUser', verifyToken, async (req, res) => {
  const userId = req.user.uid; 
  const { postalCode } = req.body; 

  try {

    const existingUser = await usersCollection.findOne({ userId });

    if (existingUser) {

      await usersCollection.updateOne(
        { userId },
        { $set: { postalCode } }
      );

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

app.post('/updateHomeUser', verifyToken, async (req, res) => {
  const userId = req.user.uid; 
  const { home } = req.body; 

  try {

    const existingUser = await usersCollection.findOne({ userId });

    if (existingUser) {

      await usersCollection.updateOne(
        { userId },
        { $set: { home } }
      );

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

app.post('/updatePhoneUser', verifyToken, async (req, res) => {
  const userId = req.user.uid; 
  const { phone } = req.body; 

  try {

    const existingUser = await usersCollection.findOne({ userId });

    if (existingUser) {

      await usersCollection.updateOne(
        { userId },
        { $set: { phone } }
      );

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

// Middleware para verificar el token de Firebase
async function verifyTokenInPage(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send('Acceso denegado. No se proporcionó token.');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Adjunta la información del usuario al objeto req
    next(); // Permite continuar con la ejecución de la ruta
  } catch (error) {
    return res.status(403).send('Token no válido.');
  }
}
// Ruta protegida (requiere autenticación)
app.get('../app/(tabs)', verifyToken, (req, res) => {
  res.send('Este archivo está protegido y solo es accesible con una sesión válida.');
});


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
