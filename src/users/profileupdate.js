import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import firebase from "../config/base";
import { Instagram } from "react-content-loader";
import { Chatcontext } from "../elements/context";
import Imageupload from "../elements/imageupload";
import { useCollectionData } from "react-firebase-hooks/firestore";
const firestore = firebase.firestore();
const usersRef = firestore.collection("users");
const statusRef = firestore.collection("status");
const chatsRef = firestore.collection("chats");

function Profileupdate() {
  const history = useHistory();
  const user = useContext(Chatcontext);
  const chatsquery = firestore
    .collection("chats")
    .where("uid", "!=", user.currentUser.uid)
    .where("chatparticipants", "array-contains", user.currentUser.uid);
  const [value] = useCollectionData(chatsquery, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [file, setfile] = useState();
  const [previewUrl, setpreviewUrl] = useState();
  const [loading, setloading] = useState(false);
  const submitHandler = async () => {
    setloading(true);
    setpreviewUrl();
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(file.name);
    try {
      await fileRef
        .put(file)
        .then(() => console.log("Upload successful"))
        .catch((err) => console.log(err));
    } catch (err) {}
    let url;
    try {
      url = await fileRef.getDownloadURL();
    } catch (err) {}
    try {
      await usersRef.doc(user.currentUser.uid).update({
        imageUrl: url,
      });
    } catch (err) {}
    try {
      await statusRef.doc(user.currentUser.uid).update({
        imageUrl: url,
      });
    } catch (err) {}
    try {
      value.forEach(async (v) => {
        if (v.chatparticipants.length === 2) {
          await chatsRef
            .doc(v.chatparticipants[0] + v.chatparticipants[1])
            .update({
              imageUrl: url,
            });
        }
      });
    } catch (err) {}

    history.push("/users");
  };

  return (
    <main
      className="users-list"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <nav className="nav-group">
        <Link to="/users">
          <img src="./arrow.png" alt="back" className="private-arrow" />
        </Link>
        <section>
          <p>Update profile picture</p>
        </section>
      </nav>
      <section className="usersbody">
        {loading && (
          <section className="loading">
            <Instagram />
          </section>
        )}
        <Imageupload
          Upload={{
            file,
            setfile,
            submitHandler,
            setpreviewUrl,
            previewUrl,
            loading,
            btn: true,
          }}
        />
      </section>
    </main>
  );
}

export default Profileupdate;
