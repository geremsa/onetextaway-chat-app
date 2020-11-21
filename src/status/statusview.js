import React,{useState} from "react";
import {useParams, withRouter, useHistory } from "react-router-dom";
import firebase from "../config/base";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import moment from "moment";
const auth = firebase.auth();
const firestore = firebase.firestore();
const statusRef = firestore.collection("status");
function Statusview(props) {
  const [user] = useAuthState(auth);
  const [current, setcurrent] = useState(1);
  const uid = useParams().sid
  const history = useHistory()
  const opacity =(current===props.location.state.statusUrls.length -1)? 0 : 1
  const pointerEvents =(current===props.location.state.statusUrls.length -1)? "none" : "all"
  const goLeft =()=>{
    setcurrent(p=>{
      if(current === props.location.state.statusUrls.length -1){
        return 0;
      }
      return p+1;
    })
  }
  const goRight =()=>{
    setcurrent(p=>{
      if(current === 0){
        return props.location.state.statusUrls.length -1;
      }
      return p-1;
    })
  }
  return (
    <div className="status-view-page">
    <section className="title-status-view">
       {uid === user.uid && <span className="view-delete">Delete</span>}
      <span onClick={()=>history.goBack()} className="close-btn">Go back</span>
    </section>
    <div className="status-swipe">
      {props.location.state.statusUrls.map((p, i) => (
        <section className="status-container" key={i} style={{transform: (current===i)? "translateX(0)": "translateX(100%)",opacity:(current===i)? 1 : 0 }}>
            <img src={p.url} alt="img" style={{transform: (current===i)? "translateX(0)": "translateX(100%)"}}/>
            <div className="view-bottom">
           <span className="view-delete" onClick={goRight} style={{opacity:(current===0)? 0 : 1 ,pointerEvents: (current===0)?"none": "all"}}>Prev</span>
            <span className="view-time" >
            {moment(p.createdAt.toDate()).fromNow()}
            </span> 
            <span className="view-delete" onClick={goLeft} style={{opacity, pointerEvents }} >Next</span>
            </div>
        </section>
      ))}
    </div>
    </div>
  );
}
// style={{display: (current===i)? "flex" : "none"}
export default withRouter(Statusview);
