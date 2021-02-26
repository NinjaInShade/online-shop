import React, { useState, useEffect } from "react";

import "./Input.css";

export default function Input({ label, placeholder, type = "text", value, setValue }) {
  const [hasTyped, setHasTyped] = useState(false);

  useEffect(() => {
    setValue((prevState) => ({ ...prevState, hasTyped: hasTyped }));
  }, [hasTyped, setValue]);

  function validateInput(value) {
    setValue((prevState) => ({ ...prevState, value: value }));
    setHasTyped(true);

    // Sanitize
    value.trim();

    // Email validator
    if (type === "email") {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return setValue((prevState) => ({ ...prevState, error: re.test(String(value).toLowerCase()) ? "default" : "Not an email" }));
    }

    // Value must not be empty
    if (value.length < 1) {
      return setValue((prevState) => ({ ...prevState, error: "Cannot be empty" }));
    }

    // Password validator
    if (type === "password") {
      if (value.length < 8) {
        return setValue((prevState) => ({ ...prevState, error: "Must be atleast 8 chars" }));
      }

      // Atleast one capital letter
      // const re = /^[a-zA-Z]*[A-Z]+[a-zA-Z]*$/;
      // return setValue((prevState) => ({ ...prevState, error: re.test(String(value)) ? "default" : "Atleast one capital letter" }));
    }

    // Name validator
    if (label === "name" && value.length > 15) {
      return setValue((prevState) => ({ ...prevState, error: "Cannot exceed 15 chars" }));
    }

    setValue((prevState) => ({ ...prevState, error: "default" }));
  }

  return (
    <div className="input-container">
      <label className="input-label" style={value.error !== "default" ? { color: "var(--red-600)" } : {}}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="input-box"
        value={value.value}
        onChange={(e) => validateInput(e.target.value)}
        style={value.error !== "default" ? { background: "var(--red-100)", border: "2px solid var(--red-600)" } : {}}
      />
      <p className="error-text" style={value.error !== "default" ? {} : { visibility: "hidden" }}>
        *{value.error}
      </p>
    </div>
  );
}
