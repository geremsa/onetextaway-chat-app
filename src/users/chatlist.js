import React, {useContext} from "react";
import { Link } from "react-router-dom";
import "./userlist.css";
import firebase from "../config/base";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Header from "../elements/header";
import moment from "moment";
import { Facebook } from 'react-content-loader'
import { Chatcontext } from "../elements/context";
const firestore = firebase.firestore();
const chatsRef = firestore.collection("chats");

function Chatslist() {
  const user = useContext(Chatcontext);
  const query = chatsRef
    .where("chatparticipants", "array-contains", `${user.currentUser.uid}`)
    .orderBy("createdAt", "desc");
  const [value, loading, error] = useCollectionData(query, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  return (
    <main className="users-list">
      <Header />
      <section className="users-body">
        {loading && <div className="loading" style={{marginTop:"15px"}} >
        <Facebook />
        <Facebook />
        </div>}
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
          value.map((p,i) => (
            <Link
              to={{
                pathname: `/${p.groupUid ? 'groupchat':'chat'}/${p.groupUid || p.chatparticipants[0]}`,
                state: {
                  imageUrl: p.imageUrl,
                  uid: p.groupUid || p.chatparticipants[0],
                  participants: p.participants || null,
                  name: p.name
                },
              }}
              key={i}
              className="media-list chat-media"
            >
              <img src={p.imageUrl} alt="img" className="media-list-img" />
              <section className="chat-list-text">
                <div>
                  <span id="chat-name-person">{p.name}</span>
                  <span style={{ display: "inline-block" }} id="time-chat">
                    {moment(p.createdAt.toDate()).format("LT")}
                  </span>
                </div>
                <span id="text-chat">{p.text}</span>
                {/* <button onClick={()=>console.log(p.createdAt)}>show
        </button> */}
              </section>
            </Link>
          ))}
      </section>
    </main>
  );
}

export default Chatslist;
