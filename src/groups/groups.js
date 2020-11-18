import React from "react";
import { Link } from "react-router-dom";
import '../users/userlist.css'
import firebase from "../config/base";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "../elements/header";
import './group.css';
const auth = firebase.auth();
const firestore = firebase.firestore();
const usersRef = firestore.collection("users");

function Groups() {
  const [user] = useAuthState(auth);
  const query = usersRef.where("uid", "!=", `${user.uid}`);
  const [value, loading] = useCollectionData(query, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  return (
    <main className="users-list">
      <Header />
      <section className="users-body">
      <Link to='/newgroup' className="create-group">
       <span>Create new group</span> 
       <img src="/group.svg" alt="plus"/>
      </Link>
        {loading && <span>Loading...</span>}
        {value &&
          value.map((p) => (
            <Link
              to={{
                pathname: `/chat/${p.name} prv`,
                state: { imageUrl: p.imageUrl,uid:p.uid },
              }}
              key={p.uid}
              className="media-list"
            >
              <img src={p.imageUrl} alt="img" className="media-list-img"/>
              <span>{p.name}</span>
            </Link>
          ))}
      </section>
    </main>
  );
}

export default Groups;

