import React from "react";
import firebase from "../config/base";
import { useParams, useHistory, withRouter } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore,
            quidem dolorum quos voluptatem non voluptatibus, necessitatibus,
            delectus reiciendis consequatur illo quia inventore? Facilis, qui
            voluptatum expedita esse ipsa inventore! Nam placeat fugiat enim
            sint iste delectus aliquam adipisci eaque id laboriosam
            reprehenderit, explicabo quaerat voluptatum animi possimus aliquid!
            Ab optio magni repudiandae reiciendis velit quo cumque asperiores
            porro, eligendi, minus possimus veniam illum alias, at sequi
            excepturi perspiciatis eos cupiditate accusantium pariatur tempora
            eius placeat obcaecati tempore? Quis sint adipisci minima
            exercitationem inventore quas molestias nostrum quidem harum
            pariatur, eos earum, neque expedita, ipsa delectus enim animi
            ducimus soluta nisi! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quod cumque aperiam architecto, deserunt
            asperiores ea pariatur obcaecati nemo sit eius optio ut at
            blanditiis nostrum aut alias labore hic tenetur corporis veniam
            quibusdam nisi ad! Magnam id dolorum excepturi sapiente maiores
            dignissimos, animi minima dolore tenetur odio deserunt corporis
            voluptatibus.
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && <span>Loading...</span>}
            {/* {value && <span>{JSON.stringify(value.data().text)}</span>} */}
            {user && value && value.map((p) => <h5 key={p.text}>{p.text}</h5>)}
            <div ref={scrolllDown}></div>
          </div>
        </section>
        <section className="emoji-drawer">
          <form onSubmit={submitHandler} className="chat-form">
            <div className="chat-type-space">
              <img
                src="/smiley.svg"
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
            <button type="submit">
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
