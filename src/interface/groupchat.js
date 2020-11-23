import React from "react";
import firebase from "../config/base";
import { useHistory, withRouter } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import "emoji-mart/css/emoji-mart.css";
import moment from "moment";
import "./p.css";
import Chatcreator from "../elements/chatcreator";
const firestore = firebase.firestore();
const auth = firebase.auth();
const groupsRef = firestore.collection("groupchats");
const chatsRef = firestore.collection("chats");
function Groupchat(props) {
  const element = React.useRef()
  const [user] = useAuthState(auth);
  const [loading, setloading] = React.useState(false)
  const [chatData, setchatData] = React.useState([]);
  const [latest, setlatest] = React.useState(null);
  const privateQuery = groupsRef
    .where("groupUid", "==", `${props.location.state.uid}`)
    .orderBy("createdAt").limitToLast(25);
    React.useEffect(()=>{
      privateQuery.onSnapshot((data=>{
        let x= []
        data.forEach(doc=>x.push(doc.data()))
    setloading(false)
      setchatData(x)
      if(scrolllDown.current){
        scrolllDown.current.scrollIntoView({ behaviour: "smooth" });
      }
      setlatest(data.docs[0])
    }))
    },[])
  const scrolllDown = React.useRef();
  const history = useHistory();
  const [text, settext] = React.useState("");
  const [open, setopen] = React.useState(false);
  const emojiDrawer = () => {
    setopen((p) => !p);
  };
  const putEmoji =(e)=>{
    settext(p=>{
      return p + e.native
    })
  }
  const submitHandler = async (e) => {
    setloading(true)
    e.preventDefault();
    setopen(false)
    const { uid, displayName } = auth.currentUser;
    let value = text;
    settext("");
    await groupsRef.add({
      text: value,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      name: displayName,
      groupUid: props.location.state.uid
    });
    scrolllDown.current.scrollIntoView({ behaviour: "smooth" });
    await chatsRef.doc(props.location.state.uid).set({
      name: props.location.state.name,
      imageUrl : "/group.svg",
      uid,
      chatparticipants: props.location.state.participants.map(v=>v.uid),
      createdAt:  firebase.firestore.FieldValue.serverTimestamp(),
      text:value,
      groupUid: props.location.state.uid,
      participants: props.location.state.participants
    },{merge: true})
  };
  const onScroll =async(e)=>{
    const {scrollTop}= e.currentTarget
    if(latest){
      let Query = groupsRef
      .where("groupUid", "==", `${props.location.state.uid}`)
      .orderBy("createdAt").endBefore(latest).limitToLast(10);
      if(scrollTop===0){
        let data=  await Query.get()
       let x= []
       data.forEach(doc=>x.push(doc.data()))
       setchatData(p=>[...x,...p])
       element.current.scrollTop = 54.44
        setlatest(data.docs[0])
      }
    }
    }
  return (
    <div className="private-chat">
      <nav className="private-navigation">
        <section>
          <img
            src="/group.svg"
            alt=""
            className="private-img"
          />
          <div>
          <span className="private-name">{ props.location.state.name}</span>
          <div className="group-chat-names">
            {props.location.state.participants.map((p,i)=><span key={i}>{p.name.split(' ')[0]}</span>)}
          </div>
          </div>
        </section>
        <img
          src="/arrow.png"
          alt="go back"
          onClick={() => history.goBack()}
          className="private-arrow"
        />
      </nav>
      <main className="chat-body">
        <section onScroll={onScroll} ref={element} className="message-box">
          <div className="chats">
            {/* {error && <strong>Error: {JSON.stringify(error)}</strong>} */}
            {/* <button onClick={()=>console.log(error)}>show</button> */}
            {/* {loading && <span>Loading...</span>} */}
            {user &&
              chatData.length!==0 &&
              chatData.map((p,i) => (
                <div
                  key={p.text + i}
                  className={p.uid === user.uid ? "mychat mine" : "yourchat yours"}
                > 
                {p.uid === user.uid ? "" : <h5>{p.name.split(' ')[0]}</h5>}
                <span>
                  {p.text}
                  {p.createdAt && (
                    <span id="clock-chat">
                      {moment(p.createdAt.toDate()).format("LT")}
                    </span>
                  )}{" "}
                </span>
                </div>
              ))}
              { loading && <p key="loading" className="mychat" style={{fontStyle:"italic"}}>sending...</p>}
            <div ref={scrolllDown}></div>
          </div>
        </section>
        <Chatcreator  Crray={{open,submitHandler,emojiDrawer,text,settext,putEmoji}}/>
      </main>
    </div>
  );
}

export default withRouter(Groupchat);

