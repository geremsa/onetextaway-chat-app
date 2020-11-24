import React, {useEffect,useState,useRef} from 'react'

function Imageupload({Upload}) {
    const fileRef = useRef();
    const [isValid, setisValid] = useState(true);
    useEffect(() => {
        if (!Upload.file) {
          return;
        }
        const filereader = new FileReader(); //1
        filereader.onload = () => {
          //3
          Upload.setpreviewUrl(filereader.result);
        };
        filereader.readAsDataURL(Upload.file); //2
      }, [Upload.file]);
      const picked = async(event) => {
        let pickedFile;
        if (event.target.files && event.target.files.length === 1) {
          pickedFile = event.target.files[0];
          Upload.setfile(pickedFile);
          setisValid(true);
        } else {
          setisValid(false);
        }
      };
      const pickimage=()=>{
        fileRef.current.click()
    }
    return (
        <div className={`form-status`} style={{opacity: Upload.loading ? 0 : 1}}>
        <input
          type="file"
          name=""
          id=""
          ref={fileRef}
          onChange={picked}
          style={{ display: "none" }}
        />
        <div className={`preview ${Upload.propClass}`}>
          <div className="image-upload__preview profile-update">
            {Upload.previewUrl && <img src={Upload.previewUrl} alt="preview" />}
            {!Upload.previewUrl && (
              <p>
                No file choosen
              </p>
            )}
          </div>
          <section className="submit-newstatus">
          <div type="button" key="pick" className="pick-btn" onClick={pickimage}>
            Choose a picture
          </div>
         {Upload.btn && <div type="button" key="submit" className="pick-btn" style={{background:(Upload.previewUrl && isValid) ?"#f05454":"grey"}} onClick={(Upload.previewUrl && isValid) ? Upload.submitHandler : ()=>{}}>
            Upload
          </div>}
          </section>
        </div>
      </div>
    )
}

export default Imageupload
