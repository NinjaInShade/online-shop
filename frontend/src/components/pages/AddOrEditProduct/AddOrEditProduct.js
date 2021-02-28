import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { titleValidate, descriptionValidate, priceValidate } from "../../../validators";
import Button from "../../Button/Button";
import FilePicker from "../../FilePicker/FilePicker";
import Input from "../Profile/Input";
import useForm from "../../../hooks/useForm";
import axios from "axios";

export default function EditProduct({ add }) {
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

  const [image, setImage] = useState();

  useEffect(() => {
    if (add) {
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_DOMAIN}products/${prod_id}`)
      .then((response) => {
        const data = response.data;

        setImage({ name: data.product.image_url });
        setTitle((prevState) => ({ ...prevState, value: data.product.title }));
        setDescription((prevState) => ({ ...prevState, value: data.product.description }));
        setPrice((prevState) => ({ ...prevState, value: data.product.price }));
      })
      .catch((error) => {
        return console.log(error);
      });
  }, [prod_id, add]);

  function submitForm(e) {
    e.preventDefault();

    const domain = add ? `${process.env.REACT_APP_API_DOMAIN}admin/add-product/` : `${process.env.REACT_APP_API_DOMAIN}admin/edit-product/${prod_id}`;
    const enableTyped = add ? true : false;

    validateAndSendForm(
      [title, description, price],
      domain,
      {
        title: title.value,
        description: description.value,
        price: price.value,
        image,
      },
      (err, data) => {
        if (err) {
          return console.log(err);
        }

        return history.push("/admin/products");
      },
      { enableTyped, file: true }
    );
  }

  return (
    <main className="page-center">
      <form>
        <h2 className="header">{add ? "Add product" : "Edit Product"}</h2>
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

        <FilePicker image={image} setImage={setImage} />

        <Button onClick={(e) => submitForm(e)} className="submit-form">
          {loading ? <p className="loading">{add ? "Adding product" : "Editing product"}</p> : <p>{add ? "Add product" : "Edit product"}</p>}
        </Button>
        <p className="error-text" style={globalError === undefined ? { visibility: "hidden" } : {}}>
          *{globalError}
        </p>
      </form>
    </main>
  );
}
