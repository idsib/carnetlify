export function logOutFirebase(){
    signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        console.log(error);
      });
}