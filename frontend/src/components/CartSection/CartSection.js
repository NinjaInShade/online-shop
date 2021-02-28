import React from "react";

import "./CartSection.css";

export default function CartSection({ product }) {
  console.log(product);

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
          <button className="product-remove">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </section>
      <div className="seperator"></div>
    </>
  );
}
