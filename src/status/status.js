import React from "react";
import Header from "../elements/header";
import {Link} from "react-router-dom";
import firebase from "../config/base";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { BulletList } from 'react-content-loader'
import './status.css'
const auth = firebase.auth();
const firestore = firebase.firestore();
const statusRef = firestore.collection("status");
function Status() {
  const [user] = useAuthState(auth);
  const query = statusRef.where('uid','==',user.uid).orderBy('createdAt','desc')
  const [value, loading, error] = useCollectionData(query, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  return (
    <main className="users-list">
      <Header />
      <section className="users-body">
      <Link to='/newstatus' className="create-group">
       <span>Update a status</span> 
       <img src="/status.svg" alt="plus"/>
      </Link>
      {loading && <section className="loading"><BulletList /></section>
        }
        {/* <button onClick={()=>console.log(value)}>show
        </button> */}
        {value && value.length === 0 && (
          <section className="no-chat">
            <div  className="auth-text no-chat-link">
              <h4>No Status to display</h4>
            </div>
          </section>
        )}
        {value &&
          value.map((p,i) => (
            <Link
              to={{
                pathname: `/viewstatus/${p.uid}`,
                state: {name: p.name, statusUrls : p.statusUrls},
              }}
              key={i}
              style={{display: p.statusUrls.length>0? "flex" : "none"}}
              className="media-list"
            >
              <img src={p.imageUrl}  alt="img" className="media-list-img status-ring" />
              <span>{p.name}</span>
            </Link>
          ))}
      </section>
    </main>
  );
}

export default Status;
