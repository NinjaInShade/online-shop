import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import AuthContext from "../../AuthContext";
import axios from "axios";

import "./ProductCard.css";

export default function ProductCard({ title, description, price, image_url, id, admin, products, setProducts }) {
  const { auth } = useContext(AuthContext);

  function deleteProduct() {
    axios
      .delete(`${process.env.REACT_APP_API_DOMAIN}admin/delete-product/${id}`)
      .then((response) => {
        // We need page to update so change products state minus the one thats deleted.
        setProducts(products.filter((prod) => prod._id !== id));
      })
      .catch((error) => {
        return console.log(error);
      });
  }

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
              <Button className="edit-btn">
                <Link to={`/admin/edit-product/${id}`}>Edit</Link>
              </Button>

              <Button className="delete-btn" onClick={deleteProduct}>
                Delete
              </Button>
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
