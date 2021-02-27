import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import ReactDOM from "react-dom";
import authContext from "../../AuthContext";
import NAV_LINKS from "../../data";

import "./Sidebar.css";

export default function Sidebar({ show, setShow }) {
  const sidebar = document.getElementById("sidebar-portal");
  const { auth } = useContext(authContext);

  const sidebarJSX = (
    <>
      <div
        className="sidebar-overlay"
        style={show ? { opacity: "100", pointerEvents: "all" } : { opacity: "0" }}
        onClick={() => setShow(!show)}
      ></div>
      <nav className="sidebar" style={show ? {} : { right: "-250px" }}>
        <button className="hamburger" onClick={() => setShow(!show)}>
          <i className="fas fa-times"></i>
        </button>
        <ul className="sidebar-links">
          {/* Regular links */}
          {NAV_LINKS.map((navItem, index) => {
            // Don't render admin links like add product, admin product etc... if user is not an admin.
            if (navItem.admin && !auth.user.is_admin) {
              return <li key={index} style={{ display: "none" }}></li>;
            }

            return (
              <li key={index}>
                <NavLink
                  to={navItem.to}
                  exact
                  isActive={(match, location) => {
                    if ((navItem.alternative && location.pathname.includes(navItem.alternative)) || location.pathname === navItem.to) {
                      return true;
                    }
                  }}
                  activeClassName="nav-link-active"
                  className={`nav-link ${navItem.to === "/cart" ? "nav-link-icon" : navItem.to === "/profile" ? "nav-link-icon" : ""}`}
                  onClick={() => {
                    setShow(!show);
                  }}
                >
                  {navItem.title}
                </NavLink>
              </li>
            );
          })}
          <li>
            <NavLink
              to="/cart"
              exact
              activeClassName="nav-link-active"
              className={`nav-link nav-link-icon`}
              onClick={() => {
                setShow(!show);
              }}
            >
              <div className="cart-number">
                <p className="cart-value" style={auth.isAuth ? {} : { visibility: "hidden" }}>
                  {auth.isAuth ? `0${auth.user.cart.items.length}` : "00"}
                </p>
              </div>
              <span className="material-icons shopping-cart-icon">shopping_cart</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              exact
              activeClassName="nav-link-active"
              className={`nav-link nav-link-icon`}
              onClick={() => {
                setShow(!show);
              }}
            >
              <span className="material-icons">account_circle</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );

  return ReactDOM.createPortal(sidebarJSX, sidebar);
}
