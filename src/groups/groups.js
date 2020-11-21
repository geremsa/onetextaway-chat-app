import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../users/userlist.css";
import firebase from "../config/base";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Header from "../elements/header";
import { BulletList } from "react-content-loader";
import "./group.css";
import { Chatcontext } from "../elements/context";
const firestore = firebase.firestore();
const groupsRef = firestore.collection("groups");

function Groups() {
  const user = useContext(Chatcontext);
  const query = groupsRef.where("participants", "array-contains", {
    name: user.currentUser.displayName,
    uid: user.currentUser.uid,
    imageUrl: user.currentUser.photoURL,
  });
  const [value, loading] = useCollectionData(query, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  return (
    <main className="users-list">
      <Header />
      <section className="users-body">
        <Link to="/newgroup" className="create-group">
          <span>Create new group</span>
          <img src="/group.svg" alt="plus" />
        </Link>
        {loading && (
          <section className="loading">
            <BulletList />
          </section>
        )}
        {value && value.length === 0 && (
          <section className="no-chat">
            <div className="auth-text no-chat-link">
              <h4>No groups yet</h4>
            </div>
          </section>
        )}
        {value &&
          value.map((p) => (
            <Link
              to={{
                pathname: `/groupchat/${p.groupUid}`,
                state: {
                  uid: p.groupUid,
                  participants: p.participants,
                  name: p.name,
                },
              }}
              key={p.groupUid}
              className="media-list"
            >
              <div className="media-list-img group-img-list">
                <img src="/group.svg" style={{ width: "80%" }} alt="img" />
              </div>
              <span>{p.name}</span>
            </Link>
          ))}
      </section>
    </main>
  );
}

export default Groups;
