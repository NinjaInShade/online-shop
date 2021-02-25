import React from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../../assets/logo.png";

import "./Navbar.css";

const NAV_LINKS = [
  {
    title: "shop",
    to: "/",
  },
  {
    title: "products",
    to: "/products",
  },
  {
    title: "admin products",
    to: "/admin/products",
  },
  {
    title: "add product",
    to: "/admin/add-product",
  },
  {
    title: (
      <>
        <div className="cart-number">
          <p className="cart-value">02</p>
        </div>
        <span className="material-icons">shopping_cart</span>
      </>
    ),
    to: "/cart",
  },
  {
    title: <span className="material-icons">account_circle</span>,
    to: "/profile",
  },
];

export default function Navbar() {
  return (
    <div>
      <nav className="navbar">
        <div className="brand flex">
          <Link to="/">
            <img src={logo} alt="Brand logo" className="brand-image" />
          </Link>
          <h2 className="brand-header">Shop</h2>
        </div>
        <ul className="nav-links flex">
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
        </ul>
      </nav>
      <nav className="sidebar"></nav>
    </div>
  );
}
