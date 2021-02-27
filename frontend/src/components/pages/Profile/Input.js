import React, { useState, useEffect } from "react";

import "./Input.css";

export default function Input({ label, placeholder, type = "text", value, setValue, validate }) {
  const [hasTyped, setHasTyped] = useState(false);

  useEffect(() => {
    setValue((prevState) => ({ ...prevState, hasTyped: hasTyped }));
  }, [hasTyped, setValue]);

  function validateInput(value) {
    setValue((prevState) => ({ ...prevState, value: value }));
    setHasTyped(true);

    // Default validators:
    // Sanitize
    value.trim();

    // Value must not be empty
    if (value.length < 1) {
      return setValue((prevState) => ({ ...prevState, error: "Cannot be empty" }));
    }

    return setValue((prevState) => ({ ...prevState, error: validate(value) }));
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
