import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();
export function fullInfoFirebase() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const email = user.email;
       } else  {
  
      console.log("Aqui no hay nada manito")
  
    }
  })
  }

//export const OwnUidUser2 =  (uidUser) => onAuthStateChanged(auth, (user) => { if (user) { uidUser = user.uid;}})
//export const OwnUidUser = (callback) => {onAuthStateChanged(auth, (user) => { if (user) { callback(user.uid); } else { callback(null);}});};
//export const emailUser = email
//export const displayNameUser = displayName
//export const photoURLUser = photoURL