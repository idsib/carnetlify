// Importa las funciones necesarias de Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Configuración de tu app Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAPhBwWUdT-gTgh29fOQoDUge4urbIV5Xc",
  authDomain: "carnetlify-c37c7.firebaseapp.com",
  projectId: "carnetlify-c37c7",
  storageBucket: "carnetlify-c37c7.appspot.com",
  messagingSenderId: "279263040101",
  appId: "1:279263040101:web:d6dab2540fe8b3414a6c8c",
  measurementId: "G-EX2Z8MT089" // Este campo es opcional, no es necesario para la autenticación
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa y exporta la autenticación
export const auth = getAuth(app);

// Función para registrar usuarios en el backend
export const registerUserInBackend = async (userData) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(userData),
  });
};
