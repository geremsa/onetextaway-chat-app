import React, {useContext} from "react";
import { Link } from "react-router-dom";
import "./userlist.css";
import firebase from "../config/base";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Header from "../elements/header";
import { BulletList } from 'react-content-loader'
import { Chatcontext } from "../elements/context";
const firestore = firebase.firestore();
const usersRef = firestore.collection("users");

function Userslist() {
  const user = useContext(Chatcontext);
  // const query = usersRef.where("uid", "!=", `${user.currentUser.uid}`);
  const [value, loading] = useCollectionData(usersRef, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  return (
    <main className="users-list">
      <Header />
      <section className="users-body">
      {loading && <section className="loading">
        <BulletList />
        <BulletList />
        </section>}
        {value && value.length === 0 && (
          <section className="no-chat">
            <div className="auth-text no-chat-link">
              <h4>No users found</h4>
            </div>
          </section>
        )}
        {value && value.filter(v=>v.uid===user.currentUser.uid).map(p => (
        <div
              to="/users"
              key={user.currentUser.uid}
              className="media-list"
            >
              <img src={p.imageUrl} alt="img" className="media-list-img"/>
              <span>You</span>
              <Link to="/profileupdate" id="time-chat" className="create-group" style={{marginTop:0,transform: "none",fontSize:"15px"}}>Update</Link>
            </div>))
        }
        {value &&
          value.filter(v=>v.uid!==user.currentUser.uid).map((p,i) => (
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
