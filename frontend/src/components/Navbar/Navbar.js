import React, { useState, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import logo from "../../assets/logo.png";
import authContext from "../../AuthContext";
import NAV_LINKS from "../../data";

import "./Navbar.css";

export default function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const { auth } = useContext(authContext);

  return (
    <div>
      <Sidebar show={sidebar} setShow={setSidebar} />
      <nav className="navbar">
        <div className="brand flex">
          <Link to="/">
            <img src={logo} alt="Brand logo" className="brand-image" />
          </Link>
          <h2 className="brand-header">Shop</h2>
        </div>
        <ul className="nav-links">
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
                  activeClassName="nav-link-active"
                  className={`nav-link ${navItem.to === "/cart" ? "nav-link-icon" : navItem.to === "/profile" ? "nav-link-icon" : ""}`}
                >
                  {navItem.title}
                </NavLink>
              </li>
            );
          })}
          <li>
            <NavLink to="/cart" exact activeClassName="nav-link-active" className={`nav-link nav-link-icon`}>
              <div className="cart-number">
                <p className="cart-value" style={auth.isAuth ? {} : { visibility: "hidden" }}>
                  {auth.isAuth ? `0${auth.user.cart.items.length}` : "00"}
                </p>
              </div>
              <span className="material-icons">shopping_cart</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" exact activeClassName="nav-link-active" className={`nav-link nav-link-icon`}>
              <span className="material-icons">account_circle</span>
            </NavLink>
          </li>
        </ul>
        <button className="hamburger" onClick={() => setSidebar(!sidebar)}>
          <i className="fas fa-bars"></i>
        </button>
      </nav>
    </div>
  );
}
