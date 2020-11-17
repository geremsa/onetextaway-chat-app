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
  const [user] = useAuthState(auth);
  const privateQuery = messagesRef
    .where("uid", "==", `${user.uid}`)
    .where("to", "==", `${props.location.state.uid}`)
    .orderBy("createdAt");
  const [value, loading, error] = useCollectionData(privateQuery, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

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
  React.useEffect(() => {
    if (value)
    scrolllDown.current.scrollIntoView({ behaviour: "smooth" });
  }, [value]);
  const submitHandler = async (e) => {
    e.preventDefault();
    const { uid } = auth.currentUser;
    await messagesRef.add({
      text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      to: props.location.state.uid,
    });
    scrolllDown.current.scrollIntoView({ behaviour: "smooth" });
    await chatsRef.doc(props.location.state.uid).set({
      name: person[0],
      imageUrl : props.location.state.imageUrl,
      uid,
      chatUid: props.location.state.uid,
      createdAt:  firebase.firestore.FieldValue.serverTimestamp(),
      text
    },{merge: true})
    settext("");

  };
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
        <section className="message-box">
          <div className="chats">
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && <span>Loading...</span>}
            {user &&
              value &&
              value.map((p,i) => (
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
