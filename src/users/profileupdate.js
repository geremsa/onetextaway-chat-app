import React, { useEffect, useState, useRef, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import firebase from "../config/base";
import { Instagram } from 'react-content-loader'
import { Chatcontext } from "../elements/context";
const firestore = firebase.firestore();
const usersRef = firestore.collection("users");
const statusRef = firestore.collection("status");
const chatsRef = firestore.collection("chats");

function Profileupdate() {
  const fileRef = useRef();
  const history = useHistory()
  const user = useContext(Chatcontext)
  const [file, setfile] = useState();
  const [previewUrl, setpreviewUrl] = useState();
  const [isValid, setisValid] = useState(true);
  const [loading, setloading] = useState(false)

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
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setfile(pickedFile);
      setisValid(true);
    } else {
      setisValid(false);
    }
  };
  const submitHandler = async()=>{
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
 try{
    let url = await fileRef.getDownloadURL()
     await usersRef.doc(user.currentUser.uid).update({
       imageUrl: url
     })
     await statusRef.doc(user.currentUser.uid).update({
       imageUrl: url
     })
     await chatsRef.doc(user.currentUser.uid).update({
       imageUrl: url
     })
 }
 catch(err){
    throw new Error(err);
 }
      
      history.push('/users')
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
        <Link to="/users">
          <img src="./arrow.png" alt="back" className="private-arrow" />
        </Link>
        <section>
          <h4>Update your profile picture</h4>
        </section>
      </nav>
      <section className="usersbody">
      {loading && <section className="loading">
        <Instagram/>
      </section>}
        <div className="form-status" style={{opacity: loading ? 0 : 1}}>
          <input
            type="file"
            name=""
            id=""
            ref={fileRef}
            onChange={picked}
            style={{ display: "none" }}
          />
          <div className="preview">
            <div className="image-upload__preview profile-update">
              {previewUrl && <img src={previewUrl} alt="preview" />}
              {!previewUrl && (
                <p>
                  No file choosen
                </p>
              )}
            </div>
            <section className="submit-newstatus">
            <div type="button" key="pick" className="pick-btn" onClick={pickimage}>
              Choose a picture
            </div>
            <div type="button" key="submit" className="pick-btn" style={{background:(previewUrl && isValid) ?"#f05454":"grey"}} onClick={(previewUrl && isValid) ? submitHandler : ()=>{}}>
              Upload
            </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Profileupdate;
