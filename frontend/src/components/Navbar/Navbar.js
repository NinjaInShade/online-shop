import React, { useState, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import logo from "../../assets/logo.png";
import authContext from "../../AuthContext";
import NAV_LINKS from "../../data";

import "./Navbar.css";

export default function Navbar() {
  const [show, setShow] = useState(false);
  const { auth } = useContext(authContext);

  function enableTooltip(type) {}

  return (
    <div>
      <Sidebar show={show} setShow={setShow} />
      <nav className="navbar">
        <div className="brand flex">
          <Link to="/">
            <img src={logo} alt="Brand logo" className="brand-image" />
          </Link>
          <h2 className="brand-header" onClick={() => setShow(!show)}>
            Shop
          </h2>
        </div>
        <ul className="nav-links flex">
          {/* Regular links */}
          {NAV_LINKS.map((navItem, index) => {
            return (
              <li key={index}>
                <NavLink
                  to={navItem.to}
                  exact
                  activeClassName="nav-link-active"
                  className={`nav-link ${navItem.to === "/cart" ? "nav-link-icon" : navItem.to === "/profile" ? "nav-link-icon" : ""}`}
                >
                  {navItem.title}
                </NavLink>
              </li>
            );
          })}
          {/* Icon links to cart and profile, had to extract out of data.js file as cart's value is dynamic and profile & cart need state. */}
          <li>
            {auth.isAuth ? (
              <NavLink to="/cart" exact activeClassName="nav-link-active" className={`nav-link nav-link-icon`}>
                <div className="cart-number">
                  <p className="cart-value">02</p>
                </div>
                <span className="material-icons">shopping_cart</span>
              </NavLink>
            ) : (
              <span className="nav-link nav-link-icon" onClick={() => enableTooltip("cart")}>
                <div className="cart-number">
                  <p className="cart-value" style={{ visibility: "hidden" }}>
                    00
                  </p>
                </div>
                <span className="material-icons">shopping_cart</span>
              </span>
            )}
          </li>
          <li>
            {auth.isAuth ? (
              <NavLink to="/profile" exact activeClassName="nav-link-active" className={`nav-link nav-link-icon`}>
                <span className="material-icons">account_circle</span>
              </NavLink>
            ) : (
              <span className="nav-link nav-link-icon" onClick={() => enableTooltip("profile")}>
                <span className="material-icons">account_circle</span>
              </span>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}
