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
  const [Grray, setGrray] = React.useState([{name: user.displayName, uid: user.uid, imageUrl: user.photoURL}]);
  const [done, setdone] = React.useState(false);
  const query = usersRef.where("uid", "!=", `${user.uid}`);
  const [value, loading] = useCollectionData(query, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const added =(e,uid)=>{
    let val = e.target.src.split('/')[3]
    if(val === 'add.png'){
      e.target.src = "added.png"
      setGrray(p=>[...p,uid])
    } 
    else{
       e.target.src = "add.png"
      setGrray(p=>p.filter(v=>v!==uid)) 
  }}
  return (
    <main className="users-list">
      <nav className="nav-group">
      {!done && <Link to='/groups'>
        <img src="./arrow.png" alt="back" className="private-arrow" />
      </Link>}
      {done && <img src="./arrow.png" alt="back" onClick={()=>setdone(false)} className="private-arrow" />}
      
        <section>
          <h4>Create new group</h4>
          <h6>Add participants</h6>
        </section>
        {!done &&  <span style={{display: (Grray.length>2)? "inline-block" : "none"}} onClick={()=>setdone(true)} className="add-btn">Done</span>}
        {done &&  <span style={{display: (Grray.length>2)? "inline-block" : "none"}} onClick={()=>{}} className="add-btn">Create</span>}
      </nav>
      {!done &&
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
              <img src="add.png" alt="add" id={`add${i}`} onClick={(e)=>{
                added(e,p);

              }} className="group-add"/>
            <button onClick={()=>console.log(Grray)}>show</button>
            </div>
          ))}
      </section>
      }
      {done &&
          <section className="done-body">
            <div className="input-done">
              <input type="text"/>
              <span>Enter a group name</span>
            </div>
            <div className="participants">
              {Grray.map((p,i)=><section key={p+i} className="sec-participants">
                  <img src={p.imageUrl} alt="img"/>
                  <span>{p.name.split(' ')[0]}</span>
              </section>)}
            </div>
          </section>
          }
    </main>
  );
}
export default Newgroup;
