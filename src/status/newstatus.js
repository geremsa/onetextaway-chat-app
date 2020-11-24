import React, { useEffect, useState, useRef, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import firebase from "../config/base";
import { Instagram } from 'react-content-loader'
import { Chatcontext } from "../elements/context";
const firestore = firebase.firestore();
const statusRef = firestore.collection("status");

function Newstatus() {
  const fileRef = useRef();
  const history = useHistory()
  const user = useContext(Chatcontext)
  const [file, setfile] = useState();
  const [previewUrl, setpreviewUrl] = useState();
  const [isValid, setisValid] = useState(true);
  const [loading, setloading] = useState(false)
  const query = statusRef.where('uid','==', user.currentUser.uid)

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
      let data=  await query.get()
      if(data.empty){
        await statusRef.doc(user.currentUser.uid).set({
          name: user.currentUser.displayName,
          imageUrl : user.currentUser.photoURL,
          uid: user.currentUser.uid,
          statusUrls:[{ url: await fileRef.getDownloadURL(), createdAt: new Date()}],
          createdAt: new Date()
        },{merge: true})   
      }
      else{
        await statusRef.doc(user.currentUser.uid).update({
          createdAt: new Date(),
          statusUrls : firebase.firestore.FieldValue.arrayUnion({ url: await fileRef.getDownloadURL(), createdAt: new Date()})
        })
      }
      history.push('/status')
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
          <div className="preview" style={{height:"70vh"}}>
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

export default Newstatus;
