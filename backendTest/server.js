const express = require('express');
const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Importa cors
require('dotenv').config({ path: './url.env' });

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(require('./firebaseServiceAccountKey.json'))
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
  }
  res.status(201).send('Usuario registrado');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

app.get('/userProfile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const userProfile = await usersCollection.findOne({ userId });
    if (userProfile) {
      res.status(200).json(userProfile);
    } else {
      res.status(404).send('Perfil de usuario no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener perfil del usuario');
  }
});
