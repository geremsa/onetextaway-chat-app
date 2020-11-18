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
  const [add, setadd] = React.useState(true);
  const query = usersRef.where("uid", "!=", `${user.uid}`);
  const [value, loading] = useCollectionData(query, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const added =(i)=>{
      var imgRef = document.getElementById(`add${i}`);
          imgRef.src = "./added.png"
          setadd(p=>!p)
  }
  const removed =(i)=>{
      var imgRef = document.getElementById(`add${i}`);
          imgRef.src = "./add.png"
          setadd(p=>!p)
  }
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
          value.map((p,i) => (
            <div
              to={{
                pathname: `/chat/${p.name} prv`,
                state: { imageUrl: p.imageUrl, uid: p.uid },
              }}
              key={p.uid}
              className="media-list"
            >
              <img src={p.imageUrl} alt="img" className="media-list-img" />
              <span>{p.name}</span>
              <img src="./add.png" alt="add" id={`add${i}`} onClick={add ? ()=>{added(i)} : ()=>{removed(i)}} className="group-add"/>
            </div>
          ))}
      </section>
    </main>
  );
}
// {add ? "./add.png" : "./added.png"}
export default Newgroup;
