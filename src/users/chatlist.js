import React from "react";
import { Link } from "react-router-dom";
import "./userlist.css";
import firebase from "../config/base";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Header from "../elements/header";
const firestore = firebase.firestore();
const chatsRef = firestore.collection("chats");

function Chatslist() {
  const query = chatsRef.orderBy("createdAt", "desc");
  const [value, loading, error] = useCollectionData(query, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  return (
    <main className="users-list">
      <Header />
      <section className="users-body">
        {loading && <span>Loading...</span>}
        {error && <p>{error}</p>}
        {value && value.length === 0 && 
        <section className="no-chat">
            <Link to='/users'>You have no chats yet.<br/>Start a conversation</Link>
        </section>}
        {value &&
          value.length !== 0 &&
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

export default Chatslist;