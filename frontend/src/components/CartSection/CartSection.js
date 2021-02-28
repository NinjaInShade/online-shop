import React, { useContext } from "react";
import axios from "axios";
import AuthContext from "../../AuthContext";

import "./CartSection.css";

export default function CartSection({ product, removedProduct, setRemovedProduct }) {
  const { setAuth } = useContext(AuthContext);

  function remove(e) {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_API_DOMAIN}delete-cart/${product._id}`)
      .then((response) => {
        // Simulate a new cart item being removed so navbar UI is updated showing new cart items number.
        setAuth((prevState) => ({ ...prevState, user: { ...prevState.user, cart: { items: [prevState.user.cart.items.pop()] } } }));
        setRemovedProduct(!removedProduct);
      })
      .catch((error) => {
        return console.log(error);
      });
  }

  return (
    <>
      <section className="cart-section flex">
        <img src={`${process.env.REACT_APP_API_DOMAIN}${product.image_url}`} alt="Product" className="product-img" />
        <div className="product-info">
          <div>
            <p className="product-title">{product.title}</p>
            <p className="product-description">{product.description}</p>
          </div>
          <p className="product-quantity">Qty: {product.quantity}</p>
          <p className="product-price">
            <span className="product-currency">£</span>
            {product.price}
          </p>
          <button className="product-remove" onClick={(e) => remove(e)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      </section>
      <div className="seperator"></div>
    </>
  );
}
