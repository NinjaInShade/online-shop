import React, { useContext, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Button from "../Button/Button";
import AuthContext from "../../AuthContext";
import axios from "axios";

import "./ProductCard.css";

export default function ProductCard({ title, description, price, image_url, id, admin, products, setProducts }) {
  const { auth, setAuth } = useContext(AuthContext);
  const [addedToCart, setAddedToCart] = useState(false);

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

  function addToCart() {
    axios
      .post(`${process.env.REACT_APP_API_DOMAIN}cart`, {
        productID: id,
      })
      .then((response) => {
        // Simulate a new cart item being added so navbar UI is updated showing new cart items number.
        setAuth((prevState) => ({ ...prevState, user: { ...prevState.user, cart: { items: [...prevState.user.cart.items, []] } } }));
        setAddedToCart(true);
      })
      .catch((error) => {
        return console.log(error);
      });
  }

  return (
    <>
      {addedToCart ? <Redirect to="/cart" /> : null}
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
                {auth.isAuth && (
                  <Button className="add-cart-btn" onClick={addToCart}>
                    Add to cart
                  </Button>
                )}
                <Button className="detail-btn" style={auth.isAuth ? {} : { width: "100%" }}>
                  <Link to={`/products/${id}`}>Detail</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
