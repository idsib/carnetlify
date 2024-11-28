import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();
export function uidUser2() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const email = user.email;
        const displayName = user.displayName
        const photoURL = user.photoURL || "URL por defecto";
  
        console.log("ID:", uid);
        console.log("Email:", email);
        console.log("Nombre:", displayName);
        console.log("Foto:", photoURL);
  
       } else  {
  
      console.log("Aqui no hay nada manito")
  
    }
  })
  }

export const uidUser =  (onAuthStateChanged(auth, (user) => { if (user) { user.uid;}}))
//export const emailUser = email
//export const displayNameUser = displayName
//export const photoURLUser = photoURL