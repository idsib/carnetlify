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

// Funciones para operar en MongoDB, aqui tenemos las funciones que enviaran los fetch al servidor Mongo =>.
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
    // Mensaje de error en casuistica negativa.
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
export const changeStateLocked = async () => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/users/block', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    }
  });
};
// Función para cambiar el estado de una lección.
export const changeStateLesson = async (numberLesson) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/changeStateLesson', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    // Enviamos el numero de la lección a cambiar el estado en formato JSON.
    body: JSON.stringify(numberLesson),
  });
};
// Función para borrar usuarios en el backend.
export const deleteUserMongo = async () => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/users/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    }
  });
};
// Función para mostrar progreso del usuario en el backend.
export const showProgressMongo = async () => {
  try {
    const token = await auth.currentUser.getIdToken();
    // En este caso guardamos el resultado del fetch para luego enviarlo.
    const response = await fetch('http://localhost:3000/users/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      }
    });
    // Mensaje de error en casuistica negativa.
    if (!response.ok) {
      console.log("No se pudo obtener el registro")
    };
    // Almacenamos el registro en un objeto y lo enviamos.
    const record = await response.json();
    return record;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};
// Función para actualizar nombre en el backend.
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
// Función para actualizar email en el backend.
export const updateEmailUserInBackend = async (userEmail) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/updateEmailUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    // Enviamos el email del usuario en formato JSON.
    body: JSON.stringify(userEmail),
  });
};
// Función para actualizar url de la imagen de perfil en el backend.
export const updatePhotoURLUserInBackend = async (PhotoURL) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/updatePhotoURLUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    // Enviamos la url del usuario en formato JSON.
    body: JSON.stringify(PhotoURL),
  });
};
// Función para actualizar dni en el backend.
export const updateDniUserInBackend = async (userDni) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/updateDniUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    // Enviamos el dni del usuario en formato JSON.
    body: JSON.stringify(userDni),
  });
};
// Función para actualizar edad en el backend.
export const updateAgeUserInBackend = async (userAge) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/updateAgeUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    // Enviamos el edad del usuario en formato JSON.
    body: JSON.stringify(userAge),
  });
};
// Función para actualizar país en el backend.
export const updateCountryUserInBackend = async (userCountry) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/updateCountryUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    // Enviamos el país del usuario en formato JSON.
    body: JSON.stringify(userCountry),
  });
};
// Función para actualizar provincia en el backend.
export const updateProvinceUserInBackend = async (userProvince) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/updateProvinceUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    // Enviamos el nombre del usuario en formato JSON.
    body: JSON.stringify(userProvince),
  });
};
// Función para actualizar ciudad en el backend.
export const updateCityUserInBackend = async (userCity) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/updateCityUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    // Enviamos el ciudad del usuario en formato JSON.
    body: JSON.stringify(userCity),
  });
};
// Función para actualizar codigo postal en el backend.
export const updatePostalCodeUserInBackend = async (userPostalCode) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/updatePostalCodeUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    // Enviamos el codigo postal del usuario en formato JSON.
    body: JSON.stringify(userPostalCode),
  });
};
// Función para actualizar casa en el backend.
export const updateHomeUserInBackend = async (userHome) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/updateHomeUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    // Enviamos el casa del usuario en formato JSON.
    body: JSON.stringify(userHome),
  });
};
// Función para actualizar teléfono en el backend.
export const updatePhoneUserInBackend = async (userPhone) => {
  const token = await auth.currentUser.getIdToken();
  await fetch('http://localhost:3000/updatePhoneUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    // Enviamos el teléfono del usuario en formato JSON.
    body: JSON.stringify(userPhone),
  });
};
