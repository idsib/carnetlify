import { updateProfile, updateEmail } from "firebase/auth";
import { auth } from '@/backend/firebase/config';
import { updateNameUserInBackend, updateDniUserInBackend, updateAgeUserInBackend, updateCountryUserInBackend, updateProvinceUserInBackend, updateCityUserInBackend, updatePostalCodeUserInBackend, updateHomeUserInBackend, updatePhoneUserInBackend } from '@/backend/firebase/config';

export async function updateUserProfile(newDisplayName, newDni, newAge, newContry, newProvince, newCity, newPostalCode, newHome, newPhone, newPhotoURL, newEmail, newPassword) {

    if (newDisplayName) {
        await updateProfile(auth.currentUser, {
            displayName: newDisplayName

        }).then(() => {
            console.log("Usuario actualizado en firebase con los datos => name: " + newDisplayName)
        }).catch((error) => {
            console.log("Error con actualizacion con nombre y foto: " + error)
        });

        const userName = {
            fullName: newDisplayName
        };
        await updateNameUserInBackend(userName)
    }

    if (newDni) {
        const userDni = {
            dni: newDni
        };
        await updateDniUserInBackend(userDni)
    }

    if (newAge) {
        const userAge = {
            age: newAge
        };
        await updateAgeUserInBackend(userAge)
    }

    if (newContry) {
        const userCountry = {
            country: newContry
        };
        await updateCountryUserInBackend(userCountry)
    }

    if (newProvince) {
        const userProvince = {
            province: newProvince
        };
        await updateProvinceUserInBackend(userProvince)
    }

    if (newCity) {
        const userCity = {
            city: newCity
        };
        await updateCityUserInBackend(userCity)
    }

    if (newPostalCode) {
        const userPostalCode = {
            postalCode: newPostalCode
        };
        await updatePostalCodeUserInBackend(userPostalCode)
    }

    if (newPhone) {
        const userPhone = {
            phone: newPhone
        };
        await updatePhoneUserInBackend(userPhone)
    }

    if (newHome) {
        const userHome = {
            home: newHome
        };
        await updateHomeUserInBackend(userHome)
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
