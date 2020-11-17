import React from "react";
import firebase from "../config/base";
import {useAuthState} from 'react-firebase-hooks/auth'
import { useCollectionData } from "react-firebase-hooks/firestore";
const auth = firebase.auth();
const firestore = firebase.firestore();

const usersRef = firestore.collection("users");
const messagesRef = firestore.collection("messages");
const query = messagesRef.orderBy("createdAt").limit(30);
const privateQuery = messagesRef.where("uid","==","JvGqfM0J54SHcCeAUGGRvpFeoPx1").where("photoURL","==","https://lh3.googleusercontent.com/a-/AOh14GhM3q7oiK5FKoGI9WHpUECJcNhjtdRzd2bjT6bOiA=s96-c").orderBy("createdAt");

const FirestoreDocument = () => {
  const [text, settext] = React.useState("");
  const [user]=useAuthState(auth);
  const [value, loading, error] = useCollectionData(privateQuery, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  // useEffect(()=>{
  //   if(auth.currentUser){
  //   async function fetchdata(){
  //       await usersRef.doc(auth.currentUser.uid).set({
  //         person:auth.currentUser.displayName,
  //         uid:auth.currentUser.uid
  //       },{merge:true})
  //     };
  //     fetchdata();
  //   }
  // },[auth.currentUser])
  const signIn =async () => {
   
    const provider = new firebase.auth.GoogleAuthProvider();
   await auth.signInWithPopup(provider).then(async()=>{
    await usersRef.doc(auth.currentUser.uid).set({
      person:auth.currentUser.displayName,
      uid:auth.currentUser.uid
    },{merge:true})
   }).catch(err=>{})  
  };
  const signOut = () => {
    auth.signOut();
  };
  return (
    <div>
      {!user && <button onClick={signIn}>signIn</button>}
      {user && <button onClick={signOut}>signOut</button>}
      {
       user &&
      <button type="submit" onClick={async()=>await usersRef.add({
        person:"hb",
        uid:auth.currentUser.uid
      })}>Current user</button>
     }
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Document: Loading...</span>}
      {/* {value && <span>{JSON.stringify(value.data().text)}</span>} */}
      {user && value && value.map((p) => <h5 key={p.text}>{p.text}</h5>)}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const { uid, photoURL } = auth.currentUser;
          await messagesRef.add({
            text,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL,
          });
          settext("");
        }}
      >
        <input
          type="text"
          name="text"
          onChange={(e) => settext(e.target.value)}
          autoComplete="off"
          value={text}
        />
        <button type="submit">send</button>
      </form>
    </div>
  );
};

function App() {
  return <FirestoreDocument />;
}

export default App;
