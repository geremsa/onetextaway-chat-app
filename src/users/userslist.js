import React from 'react'
import {Link} from 'react-router-dom'
import './userlist.css'
import firebase from "../config/base";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Header from '../elements/header';
const auth = firebase.auth();
const firestore = firebase.firestore();
const usersRef = firestore.collection("users");
const query = usersRef.where('uid','!=',`${auth.currentUser.uid}`)


function Userslist() {
    const [value, loading, error] = useCollectionData(query, {
        snapshotListenOptions: { includeMetadataChanges: true },
      });
    return (
      <main className="users-list">
         <Header/>
          <section className="users-body">
          {loading && <span>Loading...</span>}
          { value && value.map((p) => <Link to={`chat/${p.imageUrl}' '${p.name}' '${p.uid}`} key={p.uid} className="media-list"><img src={p.imageUrl} alt=""/><span>{p.name}</span></Link>)}
          </section>
      </main>
    )
}

export default Userslist
