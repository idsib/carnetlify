import { auth, registerUserInBackend } from '@/backend/firebase/config';
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult} from 'firebase/auth';

export async function googleLogin() {

    const provider = new GoogleAuthProvider();
/* 
    signInWithPopup(auth, provider)
    .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log(user)
    const userData = {
        displayName: user,displayName,
        email: email,
        profile_img: photoUrl
    };

    await registerUserInBackend(userData);
    
    }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
    }); */


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
