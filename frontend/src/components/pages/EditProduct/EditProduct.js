import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { titleValidate, descriptionValidate, priceValidate } from "../../../validators";
import Button from "../../Button/Button";
import Input from "../Profile/Input";
import useForm from "../../../hooks/useForm";
import axios from "axios";

export default function EditProduct() {
  const { loading, globalError, validateAndSendForm } = useForm();

  let history = useHistory();
  const { prod_id } = useParams();

  const [title, setTitle] = useState({
    value: "",
    hasTyped: false,
    error: "default",
  });

  const [description, setDescription] = useState({
    value: "",
    hasTyped: false,
    error: "default",
  });

  const [price, setPrice] = useState({
    value: "",
    hasTyped: false,
    error: "default",
  });

  const [image, setImage] = useState({
    value: "",
    hasTyped: false,
    error: "default",
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_DOMAIN}products/${prod_id}`)
      .then((response) => {
        const data = response.data;

        setTitle((prevState) => ({ ...prevState, value: data.product.title }));
        setDescription((prevState) => ({ ...prevState, value: data.product.description }));
        setPrice((prevState) => ({ ...prevState, value: data.product.price }));
      })
      .catch((error) => {
        return console.log(error);
      });
  }, [prod_id]);

  function submitForm(e) {
    e.preventDefault();

    validateAndSendForm(
      [title, description, price],
      `${process.env.REACT_APP_API_DOMAIN}admin/edit-product/${prod_id}`,
      {
        title: title.value,
        description: description.value,
        price: price.value,
      },
      (err, data) => {
        if (err) {
          return console.log(err);
        }

        return history.push("/admin/products");
      },
      { enableTyped: false }
    );
  }

  return (
    <main className="page-center">
      <form>
        <h2 className="header">Edit Product</h2>
        <Input label="title" placeholder="shoe..." type="text" value={title} setValue={setTitle} validate={titleValidate} />
        <Input
          label="description"
          placeholder="Size 9 UK men's shoe, Nike..."
          type="text"
          value={description}
          setValue={setDescription}
          validate={descriptionValidate}
        />
        <Input label="price" placeholder="£25..." type="number" value={price} setValue={setPrice} validate={priceValidate} />

        <Button onClick={(e) => submitForm(e)} className="submit-form">
          {loading ? <p className="loading">Editing product</p> : <p>Edit product</p>}
        </Button>
        <p className="error-text" style={globalError === undefined ? { visibility: "hidden" } : {}}>
          *{globalError}
        </p>
      </form>
    </main>
  );
}
