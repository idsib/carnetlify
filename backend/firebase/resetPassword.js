// Importamos sendPasswordResetEmail para restablecer la contraseña
import { sendPasswordResetEmail } from "firebase/auth";
// Importamos el auth con la configuración del proyecto.
import { auth } from '@/backend/firebase/config';

export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log("Email de restablecimiento enviado");
        return { success: true, message: "Se ha enviado un email para restablecer tu contraseña" };
    } catch (error) {
        console.error("Error al enviar email de restablecimiento:", error);
        let errorMessage = "Error al enviar el email de restablecimiento";
        
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = "El email no es válido";
                break;
            case 'auth/user-not-found':
                errorMessage = "No existe una cuenta con este email";
                break;
            default:
                errorMessage = "Error al enviar el email de restablecimiento";
        }
        
        throw { success: false, message: errorMessage };
    }
}