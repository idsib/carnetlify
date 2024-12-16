import { updateProfile, updateEmail } from "firebase/auth";
import { auth } from '@/backend/firebase/config';

export function updateProfile(newDisplayName, newPhotoURL, newEmail, newPassword) {

    if (newDisplayName) {
        updateProfile(auth.currentUser, {
            displayName: newDisplayName

        }).then(() => {
            console.log("Usuario actualizado con los datos => name: " + newDisplayName)
        }).catch((error) => {
            console.log("Error con actualizacion con nombre y foto: " + error)
        });
    }

    if (newPhotoURL) {
        updateProfile(auth.currentUser, {
            photoURL: newPhotoURL

        }).then(() => {
            console.log("Usuario actualizado con los datos => photoURL: " + newPhotoURL)
        }).catch((error) => {
            console.log("Error con actualizacion con nombre y foto: " + error)
        });
    }

    if (newEmail) {
        updateEmail(auth.currentUser, newEmail).then(() => {
            console.log("Usuario actualizado con los datos => email: " + newEmail)
        }).catch((error) => {
            console.log("Error con actualización con email: " + error)
        });
    }

    if (newPassword) {
        const user = auth.currentUser;
        updatePassword(user, newPassword).then(() => {
            console.log("Usuario actualizado con los datos => contraseña: " + newEmail)
          }).catch((error) => {
            console.log("Error con actualización con email: " + error)
          });
    }
    
}
