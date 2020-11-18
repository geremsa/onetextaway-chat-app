import React from "react";
import { Link } from "react-router-dom";
import firebase from "../config/base";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
const auth = firebase.auth();
const firestore = firebase.firestore();
const usersRef = firestore.collection("users");

function Newgroup() {
  const [user] = useAuthState(auth);
  const query = usersRef.where("uid", "!=", `${user.uid}`);
  const [value, loading] = useCollectionData(query, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  return (
    <main className="users-list">
      <nav className="nav-group">
      <Link to='/groups'>
        <img src="./arrow.png" alt="back" className="private-arrow" />
      </Link>
        <section>
          <h4>Create new group</h4>
          <h6>Add participants</h6>
        </section>
      </nav>
      <section className="users-body">
        {loading && <span>Loading...</span>}
        {value &&
          value.map((p) => (
            <Link
              to={{
                pathname: `/chat/${p.name} prv`,
                state: { imageUrl: p.imageUrl, uid: p.uid },
              }}
              key={p.uid}
              className="media-list"
            >
              <img src={p.imageUrl} alt="" />
              <span>{p.name}</span>
            </Link>
          ))}
      </section>
    </main>
  );
}

export default Newgroup;
