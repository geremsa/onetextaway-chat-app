import React from "react";
import firebase from "../config/base";
import { useParams, useHistory, withRouter } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import moment from "moment";
import "./private.css";
const firestore = firebase.firestore();
const auth = firebase.auth();
const messagesRef = firestore.collection("messages");
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
  React.useEffect(() => {
    scrolllDown.current.scrollIntoView({ behaviour: "smooth" });
  }, []);
  const submitHandler = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      to: props.location.state.uid,
    });
    settext("");
    scrolllDown.current.scrollIntoView({ behaviour: "smooth" });
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
              value.map((p) => (
                <p
                  key={p.text}
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
        <section className="emoji-drawer">
          <form onSubmit={submitHandler} className="chat-form">
            <div className="chat-type-space">
              <img
                src={open ? "/text.svg" : "/smiley.svg"}
                alt="emoji"
                onClick={emojiDrawer}
                className="chat-emoji"
              />
              <input
                type="text"
                name="text"
                placeholder="Type a message"
                onChange={(e) => settext(e.target.value)}
                autoComplete="off"
                value={text}
              />
            </div>
            <button type="submit" disabled={text.length <= 1 ? true : false}>
              <img src="/send.svg" id="chat-send" alt="send" />
            </button>
          </form>
          {open && <Picker />}
        </section>
      </main>
    </div>
  );
}

export default withRouter(Privatechat);
