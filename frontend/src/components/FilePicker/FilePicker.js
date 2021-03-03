import React, { useRef } from "react";
import Button from "../Button/Button";

import "./FilePicker.css";

export default function FilePicker({ image, setImage }) {
  const inputFile = useRef(null);

  function selectFile(e) {
    e.preventDefault();

    inputFile.current.click();
  }

  return (
    <div className="file-group">
      <div className="info-group">
        <span className="material-icons">attach_file</span>
        <p>{image ? image.name : "No image selected"}</p>
      </div>
      <input
        type="file"
        name="image"
        ref={inputFile}
        style={{ display: "none" }}
        accept="image/png, image/jpeg, image/jpg"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <Button className="upload-btn" onClick={(e) => selectFile(e)}>
        Upload image
      </Button>
    </div>
  );
}
