import React from "react";
import "./Button.css";

export default function Button({ children, onClick, className, type = "button" }) {
  return (
    <button onClick={onClick} className={`btn ${className ? className : ""}`} type={type}>
      {children}
    </button>
  );
}
