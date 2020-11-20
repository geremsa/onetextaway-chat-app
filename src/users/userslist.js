import React from "react";
import { Link } from "react-router-dom";
import "./userlist.css";
import firebase from "../config/base";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "../elements/header";
import { BulletList } from 'react-content-loader'
const auth = firebase.auth();
const firestore = firebase.firestore();
const usersRef = firestore.collection("users");

function Userslist() {
  const [user] = useAuthState(auth);
  const query = usersRef.where("uid", "!=", `${user.uid}`);
  const [value, loading] = useCollectionData(query, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  return (
    <main className="users-list">
      <Header />
      <section className="users-body">
      {loading && <>
        <BulletList />
        <BulletList />
        </>}
        {value &&
          value.map((p) => (
            <Link
              to={{
                pathname: `/chat/${p.uid}`,
                state: { imageUrl: p.imageUrl,uid:p.uid, name: p.name },
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

export default Userslist;
