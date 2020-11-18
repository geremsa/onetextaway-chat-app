import React from "react";
import { Link } from "react-router-dom";
import "./userlist.css";
import firebase from "../config/base";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "../elements/header";
import moment from "moment";
const firestore = firebase.firestore();
const auth = firebase.auth();
const chatsRef = firestore.collection("chats");

function Chatslist() {
  const [user] = useAuthState(auth);
  const query = chatsRef.where("uid", "==", `${user.uid}`).orderBy("createdAt", "desc");
  const [value, loading, error] = useCollectionData(query, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  return (
    <main className="users-list">
      <Header />
      <section className="users-body">
        {loading && <span>Loading...</span>}
        {error && <p>{error}</p>}
        {value && value.length === 0 && (
          <section className="no-chat">
            <Link to="/users" className="auth-text no-chat-link">
              <h4>Start a conversation</h4>
            </Link>
          <p>You have no chats yet.</p>
          </section>
        )}
        {value &&
          value.length !== 0 &&
          value.map((p) => (
            <Link
              to={{
                pathname: `/chat/${p.name} prv`,
                state: { imageUrl: p.imageUrl, uid: p.chatUid },
              }}
              key={p.chatUid}
              className="media-list chat-media"
            >
              <img src={p.imageUrl} alt="img" className="media-list-img"/>
              <section className="chat-list-text">
              <div>
              <span>{p.name}</span><span style={{display:"inline-block"}} id="time-chat">{moment(p.createdAt.toDate()).format("LT")}</span>
              </div>
              <span id="text-chat" >{p.text}</span>
              </section>
            </Link>
          ))}
      </section>
    </main>
  );
}

export default Chatslist;
