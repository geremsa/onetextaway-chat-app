import React from "react";
import firebase from "../config/base";
import { useHistory, withRouter } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import "emoji-mart/css/emoji-mart.css";
import moment from "moment";
import "./private.css";
import Chatcreator from "../elements/chatcreator";
const firestore = firebase.firestore();
const auth = firebase.auth();
const messagesRef = firestore.collection("messages");
const chatsRef = firestore.collection("chats");
function Privatechat(props) {
  const element = React.useRef()
  const scrolllDown = React.useRef();
  const [user] = useAuthState(auth);
  const [chatData, setchatData] = React.useState([]);
  const [loading, setloading] = React.useState(false)
  const [latest, setlatest] = React.useState(null);
  const privateQuery = messagesRef
   .where("chatparticipants", "in", [user.uid + props.location.state.uid, props.location.state.uid + user.uid ])
    .orderBy("createdAt").limitToLast(18);
  React.useEffect(()=>{
    privateQuery.onSnapshot((data=>{
      let x= []
      data.forEach(doc=>x.push(doc.data()))
    setchatData(x)
    if(scrolllDown.current){
      scrolllDown.current.scrollIntoView({ behaviour: "smooth" });
    }
    setlatest(data.docs[0])
  }))
  },[])
 
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
    const { uid } = auth.currentUser;
    let value = text;
    settext("");
    await messagesRef.add({
      text: value,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      to: props.location.state.uid,
      chatparticipants : user.uid + props.location.state.uid
    });
    setloading(false)
    scrolllDown.current.scrollIntoView({ behaviour: "smooth" });
    await chatsRef.doc(props.location.state.uid).set({
      name: props.location.state.name,
      imageUrl : props.location.state.imageUrl,
      uid,
      chatparticipants:[props.location.state.uid, uid],
      createdAt:  firebase.firestore.FieldValue.serverTimestamp(),
      text:value
    },{merge: true})
    try{
      await chatsRef.doc(user.uid).update({
        createdAt: new Date(),
        text : value
      })
    }
    catch{
      return;
    }
    
  };
  const onScroll =async(e)=>{
    const {scrollTop}= e.currentTarget
    if(latest){
      let Query = messagesRef
      .where("uid", "==", `${user.uid}`)
      .where("to", "==", `${props.location.state.uid}`)
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
            src={props.location.state.imageUrl}
            alt=""
            className="private-img"
          />
          <span className="private-name">{props.location.state.name}</span>
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
          {/* <button onClick={()=>scrolllDown.current.scrollIntoView({ behaviour: "smooth" })}>show</button> */}
            {/* {error && <strong>Error: {JSON.stringify(error)}</strong>} */}
           
            {/* {loading && <span>Loading...</span>} */}
            {user &&
              chatData.length!==0 &&
              chatData.map((p,i) => (
                <p
                  key={p.text + i}
                  className={p.uid === user.uid ? "mychat" : "yourchat"}
                >
                  {p.text}
                  {p.createdAt && (
                    <span id="clock-chat">
                      {moment(p.createdAt.toDate()).format("LT")}
                    </span>
                  )}{" "}
                </p>
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

export default withRouter(Privatechat);
