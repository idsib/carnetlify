// Importamos el auth con la configuración del proyecto y la función de registro en MongoDB.
import { auth, registerUserInBackend } from '@/backend/firebase/config';
// Importamos GoogleAuthProvider que es un objeto para nuestros usuarios registrados en google,
// También importamos signInWithPopup, una aplicación proporcionada por Google para registrarse en un ventana emergente.
import { GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
export async function googleLogin() {
// Creamos una instancia del objeto GoogleAuthProvider.
    const provider = new GoogleAuthProvider();
    try {
        // Usamos la función signInWithPopup para que el usuario se registre con su cuenta y guardamos el resultado, o sea sus datos.
        const result = await signInWithPopup(auth, provider);
        // Creamos un objeto a partir de los datos recibidos en result y rellenamos predeterminadamente el resto.
        const userData = {
            fullName: result.user.displayName,
            email: result.user.email,
            plan: "null",
            isLocked: "true",
            profile_img: result.user.photoURL
        };
        // Utilizamos la funcion para registrarlo tambíen en Mongo si no esta registrado.
        await registerUserInBackend(userData);
        console.log('Usuario registrado en el backend'); 

    } catch (error) {
        console.error('Error al registrar usuario:', error);
    } 

}
