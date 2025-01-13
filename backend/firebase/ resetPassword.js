// Importamos updatePassword para la contraseña => https://firebase.google.com/docs/reference/node/firebase.User#updatepassword
import { updatePassword} from "firebase/auth";
// Importamos el auth con la configuración del proyecto.
import { auth } from '@/backend/firebase/config';

export async function resetPassword(newPassword){
    const user = auth.currentUser;
        updatePassword(user, newPassword).then(() => {
            console.log("Usuario actualizado ha actualizado la contraseña")
        }).catch((error) => {
            console.log("Error con actualización de contraseña: " + error)
        });
}