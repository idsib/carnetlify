import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Configuración de mi proyecto Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyAPhBwWUdT-gTgh29fOQoDUge4urbIV5Xc",
  authDomain: "carnetlify-c37c7.firebaseapp.com",
  projectId: "carnetlify-c37c7",
  storageBucket: "carnetlify-c37c7.appspot.com",
  messagingSenderId: "279263040101",
  appId: "1:279263040101:web:d6dab2540fe8b3414a6c8c",
  measurementId: "G-EX2Z8MT089"
};

// Inicializamos Firebase con nuestro objeto de configuración.
export const app = initializeApp(firebaseConfig);

// Inicializamos y exportamos la autenticación.
export const auth = getAuth(app);

// Funciones para operar en MongoDB, aqui tenemos las funciones que enviaran los fetch al servidor Mongo.
// Función para registrar usuarios en el backend.
export const registerUserInBackend = async (userData) => {
  // Enviamos el token del usuario actual, donde esta su información de firebase
  // y lo utilizaremos para operar con sus datos y asegurarnos de que su inicio de sesion es valida.
  const token = await auth.currentUser.getIdToken();
  // Enviamos un fetch por la url register por el metodo POST, con headers que concretan el tipo de contenido (JSON) y envian el token.
  await fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    // En el cuerpo de la solicitud enviamos los datos del usuario en formato JSON.
    body: JSON.stringify(userData),
  });
};

// Función para sacar la información de todo el usuario actual almacenada en Mongo a partir de su UID de Firebase.
export const getUserByUID = async (userId) => {
  try {
    const token = await auth.currentUser.getIdToken();
    // En este caso guardamos el resultado del fetch para luego enviarlo.
    const response = await fetch('http://localhost:3000/users/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      // Enviamos el UID del usuario en formato JSON.
      body: JSON.stringify({ userId: userId }),
    });
    // Mensaje de error en casuistica negativa
    if (!response.ok) {
      console.log("No se pudo obtener el usuario")
    };
    // Almacenamos el usuario en un objeto y lo enviamos.
    const user = await response.json();
    return user;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};
// Función para actualizar el estado isLocked del usuario en el backend.
export const changeStateLocked = async (state) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/users/block', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(state),
  });
};

// Función para actualizar usuarios en el backend.
export const updateNameUserInBackend = async (userName) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/updateNameUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    // Enviamos el nombre del usuario en formato JSON.
    body: JSON.stringify(userName),
  });
};

export const updateDniUserInBackend = async (userDni) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/updateDniUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(userDni),
  });
};

export const updateAgeUserInBackend = async (userAge) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/updateAgeUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(userAge),
  });
};

export const updateCountryUserInBackend = async (userCountry) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/updateCountryUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(userCountry),
  });
};

export const updateProvinceUserInBackend = async (userProvince) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/updateProvinceUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(userProvince),
  });
};

export const updateCityUserInBackend = async (userCity) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/updateCityUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(userCity),
  });
};

export const updatePostalCodeUserInBackend = async (userPostalCode) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/updatePostalCodeUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(userPostalCode),
  });
};

export const updateHomeUserInBackend = async (userHome) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/updateHomeUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(userHome),
  });
};

export const updatePhoneUserInBackend = async (userPhone) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/updatePhoneUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(userPhone),
  });
};
