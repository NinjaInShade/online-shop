import React, { useContext } from "react";
import Button from "../Button/Button";
import AuthContext from "../../AuthContext";

import "./ProductCard.css";

export default function ProductCard({ title, description, price, image_url, id, admin }) {
  const { auth } = useContext(AuthContext);

  console.log(id);

  return (
    <div className="product-card">
      <img src={image_url} alt={`${title} product thumbnail`} />
      <div className="content">
        <h2 className="title">{title}</h2>
        <p className="lead">{description}</p>
        <p className="price">£{price}</p>
        <div className="btns-container">
          {admin ? (
            <>
              <Button className="edit-btn">Edit</Button>
              <Button className="delete-btn">Delete</Button>
            </>
          ) : (
            <>
              {auth.isAuth && <Button className="add-cart-btn">Add to cart</Button>}
              <Button className="detail-btn" style={auth.isAuth ? {} : { width: "100%" }}>
                Detail
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
