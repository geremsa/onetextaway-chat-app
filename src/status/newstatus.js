import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import firebase from "../config/base";
import { useAuthState } from "react-firebase-hooks/auth";
const auth = firebase.auth();
const firestore = firebase.firestore();
const statusRef = firestore.collection("status");

function Newstatus() {
  const fileRef = useRef();
  const [user] = useAuthState(auth);
  const [file, setfile] = useState();
  const [previewUrl, setpreviewUrl] = useState();
  const [isValid, setisValid] = useState(true);

  useEffect(() => {
    if (!file) {
      return;
    }
    const filereader = new FileReader(); //1
    filereader.onload = () => {
      //3
      setpreviewUrl(filereader.result);
    };
    filereader.readAsDataURL(file); //2
  }, [file]);
  const picked = async(event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setfile(pickedFile);
      setisValid(true);
      fileIsValid = true;
    } else {
      setisValid(false);
      fileIsValid = false;
    }
  };
  const submitHandler = async()=>{
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
      await statusRef.doc(user.uid).set({
        name: user.displayName,
        imageUrl : user.photoURL,
        uid: user.uid,
        statusUrls:[await fileRef.getDownloadURL()],
        createdAt:  firebase.firestore.FieldValue.serverTimestamp()
      },{merge: true})  
  }

  const pickimage=()=>{
      fileRef.current.click()
  }
  return (
    <main
      className="users-list"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <nav className="nav-group">
        <Link to="/status">
          <img src="./arrow.png" alt="back" className="private-arrow" />
        </Link>
        <section>
          <h4>Update a status</h4>
        </section>
      </nav>
      <section className="usersbody">
        <div className="form-status">
          <input
            type="file"
            name=""
            id=""
            ref={fileRef}
            onChange={picked}
            style={{ display: "none" }}
          />
          <div className="preview">
            <div className="image-upload__preview">
              {previewUrl && <img src={previewUrl} alt="preview" />}
              {!previewUrl && (
                <p>
                  No file choosen
                </p>
              )}
            </div>
            <section className="submit-newstatus">
            <div type="button" key="pick" className="pick-btn" onClick={pickimage}>
              Pick a picture
            </div>
            <div type="button" key="submit" className="pick-btn" style={{background:(previewUrl)?"#f05454":"grey"}} onClick={previewUrl? submitHandler : ()=>{}}>
              Upload
            </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Newstatus;
