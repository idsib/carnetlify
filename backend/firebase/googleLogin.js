import { auth, registerUserInBackend } from '@/backend/firebase/config';
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult} from 'firebase/auth';

export async function googleLogin() {

    const provider = new GoogleAuthProvider();
    try {

        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log("credenciales google " + credential);
        const userData = {
            fullName: result.user.displayName,
            email: result.user.email,
            plan: "null",
            isLocked: "true",
            profile_img: result.user.photoURL
        };
        await registerUserInBackend(userData);
        console.log('Usuario registrado en el backend'); 

    } catch (error) {
        console.error('Error al registrar usuario:', error);
    } 

}
