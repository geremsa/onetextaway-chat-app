import React from "react";
import firebase from '../config/base'
import { useParams, useHistory, withRouter } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "./private.css";
const firestore = firebase.firestore();
const auth = firebase.auth();

function Privatechat(props) {
  // React.useEffect(()=>{
  //     console.log(props.location)
  // },[])
  const person = useParams().cid.split(" ");
  const history = useHistory();
  const [text, settext] = React.useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    // const { uid, photoURL } = auth.currentUser;
    // await messagesRef.add({
    //   text,
    //   createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    //   uid,
    //   photoURL,
    // });
    // settext("");
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
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officiis veritatis ea et, doloribus ad vero facere laudantium fugiat, voluptatibus autem cumque rerum nam nisi atque. Amet magnam voluptate id nisi, non, at nobis quod, quia dolore nihil dignissimos sequi provident quidem fugiat dicta maxime tempora iusto doloremque neque saepe error adipisci? Rem aliquam animi nam quasi quibusdam perspiciatis totam earum! Itaque illum hic molestias ipsam, saepe ad. Excepturi iste magni eius obcaecati rem earum, blanditiis laboriosam, delectus voluptatibus, praesentium natus fugit maxime similique sequi. Nemo atque ducimus explicabo, sed fugiat at itaque iste rerum praesentium obcaecati animi illo. Temporibus, ex. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci alias, dignissimos voluptas veritatis, optio, fugit fuga dolorum esse corrupti eos cumque sunt sint aperiam ipsa facere soluta? Modi illum, facilis exercitationem saepe architecto dicta laborum perferendis, dolores dolorem beatae molestiae, sunt fugit quasi. Ipsa ipsum perferendis, alias, voluptatibus quidem, laudantium ipsam molestiae esse nam itaque ratione. Animi unde id deserunt voluptatum provident quidem placeat vero natus ullam aut, voluptas laborum ipsam obcaecati repellendus ea tempore nesciunt itaque consequatur ipsa numquam, dolorem nihil temporibus excepturi. Repudiandae totam voluptas quos ea expedita nobis, in, esse voluptate recusandae placeat adipisci? Sed, est praesentium.
            </div>
        </section>
        <form onSubmit={submitHandler} className="chat-form">
          <input
            type="text"
            name="text"
            placeholder="Type a message"
            onChange={(e) => settext(e.target.value)}
            autoComplete="off"
            value={text}
          />
          <button type="submit"><img src="/send.svg" id="chat-send" alt="send"/></button>
        </form>
      </main>
    </div>
  );
}

export default withRouter(Privatechat);
