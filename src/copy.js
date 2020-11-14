import React from "react";
import firebase from "./config/base";
// import {useAuthState} from 'react-firebase-hooks/auth'
import { useDocument } from "react-firebase-hooks/firestore";
const auth = firebase.auth();
const firestore = firebase.firestore();

const FirestoreDocument = () => {
  const [value, loading, error] = useDocument(
    firestore.doc("messages/T03jDTfBaAunnzKpEDpp"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const signIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithRedirect(provider)
    auth
      .getRedirectResult()
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  };
  const signOut = () => {
    auth.signOut();
  };
  return (
    <div>
      {!auth.currentUser && <button onClick={signIn}>signIn</button>}
      {auth.currentUser && <button onClick={signOut}>signOut</button>}
      <p>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Document: Loading...</span>}
        {value && <span>{JSON.stringify(value.data().text)}</span>}
      </p>
    </div>
  );
};

function App() {
  return <FirestoreDocument />;
}

export default App;
