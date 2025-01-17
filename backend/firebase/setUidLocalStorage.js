// Importamos el auth con la configuración del proyecto.
// Importamos el onAuthStateChanged, función para sacar la información de user sin peligro de que el objeto de autenticación 
// esté en un estado intermedio (como la inicialización).
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();

// Función que utilizamos para almacenar el uid del usuario actual dado por firebase en el LocalStorage. Nos sirve para manipularlo con facilidad por todo el proyecto.
export function SetUidFirebase(callback) {
    // Utilizamos onAuthStateChanged, un observardor en el objeto Auth
    // https://firebase.google.com/docs/auth/web/manage-users?hl=es-419
    onAuthStateChanged(auth, (user) => {
        if (user) {
            localStorage.setItem("uid", user.uid);
        } else {
            console.log("No hay un usuario registrado [SetUidFirebase]")
        }
    }
    )
};