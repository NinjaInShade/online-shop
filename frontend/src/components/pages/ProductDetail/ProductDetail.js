import React, { useState, useEffect, useContext } from "react";
import { useParams, Redirect } from "react-router-dom";
import PlaceholderImage from "../../../assets/placeholder_image.png";
import AuthContext from "../../../AuthContext";
import axios from "axios";
import Button from "../../Button/Button";

import "./ProductDetail.css";

export default function ProductDetail() {
  const { auth, setAuth } = useContext(AuthContext);
  const [addedToCart, setAddedToCart] = useState(false);
  const [product, setProduct] = useState({
    title: undefined,
    description: undefined,
    price: undefined,
    image_url: undefined,
  });

  const { prod_id } = useParams();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_DOMAIN}products/${prod_id}`)
      .then((response) => {
        const data = response.data;

        setProduct(data.product);
      })
      .catch((error) => {
        return console.log(error);
      });
  }, [prod_id]);

  function addToCart() {
    axios
      .post(`${process.env.REACT_APP_API_DOMAIN}cart`, {
        productID: product._id,
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
      <main className="page-center">
        <div className="detail-container">
          <img
            src={product.image_url ? `${process.env.REACT_APP_API_DOMAIN}${product.image_url}` : PlaceholderImage}
            alt="Product"
            className="detail-image"
          />
          <div className="flex">
            <p className="detail-price">£{product.price}</p>
            <p className="detail-title">{product.title}</p>
          </div>

          <p className="detail-description">{product.description}</p>
          {auth.isAuth && (
            <Button className="cart-btn" onClick={addToCart}>
              Add to cart
            </Button>
          )}
        </div>
      </main>
    </>
  );
}
