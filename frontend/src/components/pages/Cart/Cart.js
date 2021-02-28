import { loadStripe } from "@stripe/stripe-js";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "../../Button/Button";
import CartSection from "../../CartSection/CartSection";

import "./Cart.css";

const stripePromise = loadStripe("pk_test_51IOivFKNCnwrXJXD991l8CcbdeBz5KvRYQlGtgyAXJMLLxmBuIKhfoWL01qhE2ousZLh4m5tjOLDJbgbnA81SPw900Ce37YvDN");

export default function Cart() {
  const [removedProduct, setRemovedProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_DOMAIN}cart`)
      .then((response) => {
        const data = response.data;

        setProducts(data.products);
        setTotalPrice(data.total_price);
      })
      .catch((error) => {
        return console.log(error);
      });
  }, [removedProduct]);

  const checkout = async (e) => {
    e.preventDefault();

    const stripe = await stripePromise;

    axios
      .get(`${process.env.REACT_APP_API_DOMAIN}checkout`)
      .then(async (response) => {
        const data = response.data;

        const result = await stripe.redirectToCheckout({
          sessionId: data.session_id,
        });

        if (result.error) {
          console.log(result.error.message);
        }
      })
      .catch((error) => {
        return console.log(error);
      });
  };

  return (
    <main className="page-center">
      <div className="cart-container">
        <h1 className="header">Shopping cart</h1>
        <ul className="products">
          {products.map((prod, index) => {
            return (
              <li key={index}>
                <CartSection product={prod} setRemovedProduct={setRemovedProduct} />
              </li>
            );
          })}
        </ul>
        <div className="actions-container">
          <div className="flex">
            <i className="fas fa-arrow-left"></i>
            <Link className="continue-shopping" to="/">
              Continue shopping
            </Link>
          </div>
          <div className="actions">
            <h2 className="subtotal">
              Subtotal: <span className="total-price">£{totalPrice}</span>
            </h2>
            <Button className="checkout-btn" onClick={(e) => checkout(e)}>
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
