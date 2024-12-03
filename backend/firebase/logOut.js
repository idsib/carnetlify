import { signOut } from "firebase/auth";
import { auth } from '@/backend/firebase/config';

export function logOutFirebase(){
    signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        console.log(error);
      });
}