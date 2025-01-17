// Importamos sendPasswordResetEmail para restablecer la contraseña.
import { sendPasswordResetEmail } from "firebase/auth";

// Importamos el auth con la configuración del proyecto.
import { auth } from '@/backend/firebase/config';

export async function resetPassword(email) {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log("Email de restablecimiento enviado");
        })
        .catch((error) => {
            console.error("Error al enviar email de restablecimiento:", error);
        });
}