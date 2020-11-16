import React from 'react'
import './userlist.css'
import firebase from "../config/base";
import { useCollectionData } from "react-firebase-hooks/firestore";
const firestore = firebase.firestore();
const usersRef = firestore.collection("users");


function Userslist() {
    const [value, loading, error] = useCollectionData(usersRef, {
        snapshotListenOptions: { includeMetadataChanges: true },
      });
    return (
      <main className="users-list">
          <header className="users-top">
              <div className="users-title">
                  <span>One</span>
                  <img src="./chat.svg" alt="text"/>
                  <span>away</span>
              </div>
              <nav>
               <a href="#" key="chat" className="users-link">Chat</a>
               <a href="#" key="groups" className="users-link">Groups</a>
               <a href="#" key="users" className="users-link">Users</a>
              </nav>
          </header>
          <section className="users-body">
          {loading && <span>Loading...</span>}
          { value && value.map((p) => <div key={p.uid} className="media-list"><img src={p.imageUrl} alt=""/><span>{p.name}</span></div>)}
          </section>
      </main>
    )
}

export default Userslist
