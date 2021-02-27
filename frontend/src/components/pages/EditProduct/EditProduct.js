import React, { useState, useEffect } from "react";
import Button from "../../Button/Button";
import Input from "../Profile/Input";

export default function EditProduct() {
  const [product, setProduct] = useState();

  const [mode, setMode] = useState("signup");
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState(undefined);

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

  useEffect(() => {}, []);

  function submitForm(e) {
    e.preventDefault();
  }

  return (
    <main className="page-center">
      <form>
        <h2 className="header">Edit Product</h2>
        {/* {mode === "signup" && <Input label="name" placeholder="John doe..." type="text" value={name} setValue={setName} />}
        <Input label="email" placeholder="email@email.com..." type="email" value={email} setValue={setEmail} />
        <Input label="password" placeholder="StrongPassword..." type="password" value={password} setValue={setPassword} />
        {mode === "signup" && (
          <Input label="confirm password" placeholder="StrongPassword..." type="password" value={confirmPassword} setValue={setConfirmPassword} />
        )} */}
        <Button onClick={(e) => submitForm(e)} className="submit-form">
          {loading ? <p className="loading">Edit product</p> : <p>Edit product</p>}
        </Button>
        <p className="error-text" style={globalError === undefined ? { visibility: "hidden" } : {}}>
          *{globalError}
        </p>
      </form>
    </main>
  );
}
