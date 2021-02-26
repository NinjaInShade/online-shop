import React from "react";
import ReactDOM from "react-dom";

import "./Sidebar.css";

export default function Sidebar({ show, setShow }) {
  const sidebar = document.getElementById("sidebar-portal");

  const sidebarJSX = (
    <>
      <div
        className="sidebar-overlay"
        style={show ? { opacity: "100", pointerEvents: "all" } : { opacity: "0" }}
        onClick={() => setShow(!show)}
      ></div>
      <nav className="sidebar" style={show ? {} : { right: "-250px" }}></nav>
    </>
  );

  return ReactDOM.createPortal(sidebarJSX, sidebar);
}
