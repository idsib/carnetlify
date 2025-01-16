// Importamos deleteUser para eliminar la cuenta del usuario.
import { deleteUser } from "firebase/auth";
// Importamos el auth con la configuración del proyecto.
import { auth } from '@/backend/firebase/config';
// Importamos la función para borrar el usuario en Mongo.
import { deleteUserMongo } from '@/backend/firebase/config';
export async function deleteAccount() {
    const user = auth.currentUser;
    deleteUser(user).then(() => {
        console.error("Error al eliminar la cuenta:");
      }).catch((error) => {
        console.error("Error al eliminar la cuenta:", error);
      });
    await deleteUserMongo();
}
