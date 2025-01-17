// Función modular para actualizar usuarios, dependiendo de lo que le llegue a la función actualizara o no los datos correspondientes.
// Importamos las funciones para actualizar los usuarios en Firebase.
// Tenemos updateProfile para el nombre y la url de la imagen de perfil => https://firebase.google.com/docs/reference/node/firebase.User#updateprofile
// Tenemos updateEmail para el correo electrónico => https://firebase.google.com/docs/reference/node/firebase.User#updateemail
// Tenemos updatePassword para la contraseña => https://firebase.google.com/docs/reference/node/firebase.User#updatepassword
import { updateProfile} from "firebase/auth";
// Importamos el auth con la configuración del proyecto.
import { auth } from '@/backend/firebase/config';
// Importamos las funciones para operar en MongoDB, cada una para un dato distinto del usuario.
import { updateNameUserInBackend, updateDniUserInBackend, updateAgeUserInBackend, updateCountryUserInBackend, updateProvinceUserInBackend, updateCityUserInBackend, updatePostalCodeUserInBackend, updateHomeUserInBackend, updatePhoneUserInBackend } from '@/backend/firebase/config';
export async function updateUserProfile(newDisplayName, newDni, newAge, newContry, newProvince, newCity, newPostalCode, newHome, newPhone) {
    // Condicional para actualizar el nombre.
    if (newDisplayName) {
        // Actualizamos el nombre en Firebase.
        await updateProfile(auth.currentUser, {
            displayName: newDisplayName
        }).then(() => {
            console.log("Usuario actualizado en firebase con los datos => name: " + newDisplayName)
        }).catch((error) => {
            console.log("Error con actualizacion con nombre y foto: " + error)
        });
        // Lo colocamos en formato JSON para enviarlo al servidor.
        const userName = {
            fullName: newDisplayName
        };
        // Actualizamos el nombre en MongoDB.
        await updateNameUserInBackend(userName)
    }
    // Condicional para actualizar el dni.
    if (newDni) {
        const userDni = {
            dni: newDni
        };
        await updateDniUserInBackend(userDni)
    }
    // Condicional para actualizar el edad.
    if (newAge) {
        const userAge = {
            age: newAge
        };
        await updateAgeUserInBackend(userAge)
    }
    // Condicional para actualizar el país.
    if (newContry) {
        const userCountry = {
            country: newContry
        };
        await updateCountryUserInBackend(userCountry)
    }
    // Condicional para actualizar el provincia.
    if (newProvince) {
        const userProvince = {
            province: newProvince
        };
        await updateProvinceUserInBackend(userProvince)
    }
    // Condicional para actualizar el ciudad.
    if (newCity) {
        const userCity = {
            city: newCity
        };
        await updateCityUserInBackend(userCity)
    }
    // Condicional para actualizar el codigo postal.
    if (newPostalCode) {
        const userPostalCode = {
            postalCode: newPostalCode
        };
        await updatePostalCodeUserInBackend(userPostalCode)
    }
    // Condicional para actualizar el teléfono.
    if (newPhone) {
        const userPhone = {
            phone: newPhone
        };
        await updatePhoneUserInBackend(userPhone)
    }
    // Condicional para actualizar el casa.
    if (newHome) {
        const userHome = {
            home: newHome
        };
        await updateHomeUserInBackend(userHome)
    }
}
