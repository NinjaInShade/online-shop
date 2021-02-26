import React from "react";
import Button from "../Button/Button";

import "./ProductCard.css";

export default function ProductCard({ title, description, price, image_url }) {
  return (
    <div className="product-card">
      <img src={image_url} alt={`${title} product thumbnail`} />
      <div className="content">
        <h2 className="title">{title}</h2>
        <p className="lead">{description}</p>
        <p className="price">£{price}</p>
        <div className="btns-container">
          <Button className="add-cart-btn">Add to cart</Button>
          <Button className="detail-btn">Detail</Button>
        </div>
      </div>
    </div>
  );
}
