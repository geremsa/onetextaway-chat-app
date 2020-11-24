import React, { useContext } from "react";
import uuid from "react-uuid";
import { Link, useHistory } from "react-router-dom";
import firebase from "../config/base";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Chatcontext } from "../elements/context";
import Imageupload from "../elements/imageupload";
const firestore = firebase.firestore();
const usersRef = firestore.collection("users");
const groupsRef = firestore.collection("groups");

function Newgroup() {
  const user = useContext(Chatcontext);
  const history = useHistory();
  const [file, setfile] = React.useState();
  const [previewUrl, setpreviewUrl] = React.useState();
  const [loading, setloading] = React.useState(false)
  const [Grray, setGrray] = React.useState([
    {
      name: user.currentUser.displayName,
      uid: user.currentUser.uid,
      imageUrl: user.currentUser.photoURL,
    },
  ]);
  const [done, setdone] = React.useState(false);
  const [name, setname] = React.useState("");
  const query = usersRef.where("uid", "!=", `${user.currentUser.uid}`);
  const [value, load] = useCollectionData(query, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const added = (e, uid) => {
    let val = e.target.src.split("/")[3];
    if (val === "add.png") {
      setGrray((p) => [...p, uid]);
    } else {
      setGrray((p) => p.filter((v) => v.uid !== uid.uid));
    }
  };
  const Creategroup = async () => {
    setloading(true)
    setpreviewUrl()
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(file.name)
    try {
        await fileRef
          .put(file)
          .then(() => console.log("Upload successful"))
          .catch((err) => console.log(err));
      } catch (err) {
        throw new Error(err);
      }
    await groupsRef.add({
      name,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      participants: Grray,
      uid: user.currentUser.uid,
      groupUid: uuid(),
      imageUrl: await fileRef.getDownloadURL()
    });
    history.push("/groups");
  };
  return (
    <main
      className="users-list"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <nav className="nav-group">
        {!done && (
          <Link to="/groups">
            <img src="./arrow.png" alt="back" className="private-arrow" />
          </Link>
        )}
        {done && (
          <img
            src="./arrow.png"
            alt="back"
            onClick={() => setdone(false)}
            className="private-arrow"
          />
        )}

        <section>
          <h4>Create new group</h4>
          <h6>Add participants</h6>
        </section>
        {!done && (
          <span
            style={{ display: Grray.length > 2 ? "inline-block" : "none" }}
            onClick={() => setdone(true)}
            className="add-btn"
          >
            Done
          </span>
        )}
        {done && (
          <span
            style={{
              display: Grray.length > 2 ? "inline-block" : "none",
              background: name.length > 0 ? "#f05454" : "grey",
            }}
            onClick={name.length > 0 ? Creategroup : () => {}}
            className="add-btn"
          >
            Create
          </span>
        )}
      </nav>
      {!done && (
        <section className="users-body">
          {load && <span>Loading...</span>}
          {value &&
            value.map((p, i) => (
              <div key={p.uid} className="media-list">
                <img src={p.imageUrl} alt="img" className="media-list-img" />
                <span>{p.name}</span>
                <img
                  src={Grray.includes(p) ? "added.png" : "add.png"}
                  alt="add"
                  id={`add${i}`}
                  onClick={(e) => {
                    added(e, p);
                  }}
                  className="group-add"
                />
              </div>
            ))}
        </section>
      )}
      {done && (
        <section className="done-body">
          <div className="input-done">
            <input
              type="text"
              value={name}
              onChange={(e) => setname(e.target.value)}
              autoFocus={true}
              autoComplete="false"
              className="create-input"
              placeholder="Enter a group name"
            />
          </div>
          <Imageupload Upload={{file,setfile,setpreviewUrl,previewUrl,loading,propClass: "propClass", btn: false}}/>
          <div className="participants">
            <h5>Participants</h5>
            <section>
              {Grray.map((p, i) => (
                <section key={p + i} className="sec-participants">
                  <div>
                    <img src={p.imageUrl} alt="img" />
                    <span>{p.name.split(" ")[0]}</span>
                  </div>
                </section>
              ))}
            </section>
          </div>
        </section>
      )}
    </main>
  );
}
export default Newgroup;
