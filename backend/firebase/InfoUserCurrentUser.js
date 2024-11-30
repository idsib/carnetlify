import { getAuth } from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;

export function getFullInfoUser(displayName, email, photoURL, emailVerified, uid){

    if (user !== null) {
  // The user object has basic properties such as display name, email, etc.
  displayName = user.displayName;
  email = user.email;
  photoURL = user.photoURL;
  emailVerified = user.emailVerified;

  // The user's ID, unique to the Firebase project. Do NOT use
  // this value to authenticate with your backend server, if
  // you have one. Use User.getToken() instead.
  uid = user.uid;
} else {
    console.log("nop")
}

return (displayName, email, photoURL, emailVerified, uid)
}


