import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

function Newstatus() {
  const fileRef = useRef();
  const [previewUrl, setpreviewUrl] = useState(null);
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
            <div type="button" className="pick-btn" onClick={pickimage}>
              Pick a picture
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Newstatus;
