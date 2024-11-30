import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();
export function SetUidFirebase() {
onAuthStateChanged(auth, (user) => {
    if (user) {    
        localStorage.setItem('uid', user.uid);
    } else  {
        console.log("no hay un usuario registrado")
    }
})};