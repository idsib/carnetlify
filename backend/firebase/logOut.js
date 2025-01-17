// Importamos la función signOut para desloguear al usuario actual.
import { signOut } from "firebase/auth";

// Importamos el auth con la configuración del proyecto.
import { auth } from '@/backend/firebase/config';

export function logOutFirebase(){
    // Y lo utilizamos como dicta la documentación =>.
    // https://firebase.google.com/docs/auth/web/password-auth?hl=es-419#next_steps
    signOut(auth).then(() => {
      }).catch((error) => {
        console.log(error);
      });
}