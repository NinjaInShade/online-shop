import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import ProductCard from "../../ProductCard/ProductCard";
import Pagination from "../../Pagination/Pagination";
import AuthContext from "../../../AuthContext";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import axios from "axios";

import "./ProductsList.css";

export default function Shop({ admin }) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState({
    has_previous_page: undefined,
    has_next_page: undefined,
    previous_page: undefined,
    current_page: 1,
    next_page: undefined,
    highest_page: undefined,
    total_products: undefined,
  });

  const { auth } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${process.env.REACT_APP_API_DOMAIN}products`, {
        params: {
          page: currentPage,
        },
      })
      .then((response) => {
        const data = response.data;

        setLoading(false);
        setPageData(data.pageData);
        setProducts(data.products);
      })
      .catch((error) => {
        return console.log(error);
      });
  }, [currentPage]);

  if (admin && !auth.isAuth) {
    return <Redirect to="/products" />;
  }

  return (
    <main className="products-container flex">
      <Pagination
        has_previous_page={pageData.has_previous_page}
        has_next_page={pageData.has_next_page}
        previous_page={pageData.previous_page}
        current_page={pageData.current_page}
        next_page={pageData.next_page}
        highest_page={pageData.highest_page}
        setCurrentPage={setCurrentPage}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <ul className="flex">
          {products.map((product, index) => {
            return (
              <li key={index}>
                <ProductCard
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  image_url={`${process.env.REACT_APP_API_DOMAIN}${product.image_url}`}
                  id={product._id}
                  admin={admin}
                  setProducts={setProducts}
                  products={products}
                />
              </li>
            );
          })}
        </ul>
      )}

      <Pagination
        has_previous_page={pageData.has_previous_page}
        has_next_page={pageData.has_next_page}
        previous_page={pageData.previous_page}
        current_page={pageData.current_page}
        next_page={pageData.next_page}
        highest_page={pageData.highest_page}
        setCurrentPage={setCurrentPage}
      />
    </main>
  );
}
