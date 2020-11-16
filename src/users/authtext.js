import React from "react";
import firebase from '../config/base'
import {useAuthState} from 'react-firebase-hooks/auth'
import "./authtext.css";
const auth = firebase.auth();
const firestore = firebase.firestore();
const usersRef = firestore.collection("users");

function Authtext() {
  const [user]=useAuthState(auth);
    const signIn =async () => {
   
        const provider = new firebase.auth.GoogleAuthProvider();
       await auth.signInWithPopup(provider).then(async()=>{
        await usersRef.doc(auth.currentUser.uid).set({
          name:auth.currentUser.displayName,
          uid:auth.currentUser.uid,
          imageUrl: auth.currentUser.photoURL
        },{merge:true})
       }).catch(err=>{})  
      };
      const signOut = () => {
        auth.signOut();
      };
  return (
    <section className="auth-container">
      <div className="auth-top">
        <img src="./chat.svg" alt="Chat" className="conversation" />
        <p>
          <span id="title-auth">Onetextaway</span>
          <br />
          Checking on your friends was never simpler.
        </p>
      </div>
      <div className="auth-bottom">
        <div className="auth-text" onClick={signIn}>
          <img src="./google.png" alt="G" />
          <h5>Continue with Google</h5>
        </div>
        {user && <button onClick={signOut}>signOut</button>}
        {user && <button onClick={()=>console.log(user.uid)}>show</button>}
      </div>
    </section>
  );
}

export default Authtext;
