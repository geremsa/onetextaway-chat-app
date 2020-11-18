import React from "react";
import firebase from "../config/base";
import { useParams, useHistory, withRouter } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";
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
  const [user] = useAuthState(auth);
  const [chatData, setchatData] = React.useState([]);
  const [latest, setlatest] = React.useState(null);
  const privateQuery = messagesRef
    .where("uid", "==", `${user.uid}`)
    .where("to", "==", `${props.location.state.uid}`)
    .orderBy("createdAt").limitToLast(18);
    const x =React.useCallback(async()=>{
      let data=  await privateQuery.get()
      let x= []
      data.forEach(doc=>x.push(doc.data()))
      setchatData(x)
      scrolllDown.current.scrollIntoView({ behaviour: "smooth" });
      setlatest(data.docs[0])
      console.log(data.docs[0])
    },[])
  React.useEffect(()=>{
    x();
  },[x])
  const scrolllDown = React.useRef();
  const person = useParams().cid.split(" ");
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
    });
    x();
    scrolllDown.current.scrollIntoView({ behaviour: "smooth" });
    await chatsRef.doc(props.location.state.uid).set({
      name: person[0],
      imageUrl : props.location.state.imageUrl,
      uid,
      chatUid: props.location.state.uid,
      createdAt:  firebase.firestore.FieldValue.serverTimestamp(),
      text:value
    },{merge: true})
  };
  const onScroll =async(e)=>{
    const {scrollTop}= e.currentTarget
    console.log(scrollTop)
    if(latest){
      let Query = messagesRef
      .where("uid", "==", `${user.uid}`)
      .where("to", "==", `${props.location.state.uid}`)
      .orderBy("createdAt").endBefore(latest).limitToLast(4);
      if(scrollTop===0){
       let data=  await Query.get()
       let x= []
       data.forEach(doc=>x.push(doc.data()))
       console.log(x)
        setchatData(p=>[...x,...p])
        element.current.scrollTop = 20
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
          <span className="private-name">{person[0]}</span>
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
                <p
                  key={p.text + i}
                  className={p.uid === user.uid ? "mychat" : "yourchat"}
                >
                  {p.text}
                  {p.createdAt && (
                    <span id="time-chat">
                      {moment(p.createdAt.toDate()).format("LT")}
                    </span>
                  )}{" "}
                </p>
              ))}
            <div ref={scrolllDown}></div>
          </div>
        </section>
        <Chatcreator  Crray={{open,submitHandler,emojiDrawer,text,settext,putEmoji}}/>
      </main>
    </div>
  );
}

export default withRouter(Privatechat);
