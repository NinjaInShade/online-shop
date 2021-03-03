import React, { useState, useContext } from "react";
import { nameValidate, emailValidate, passwordValidate } from "../../../validators";
import useForm from "../../../hooks/useForm";
import Input from "./Input";
import Button from "../../Button/Button";
import authContext from "../../../AuthContext";
import "./AuthForm.css";

export default function AuthForm() {
  const [mode, setMode] = useState("signup");
  const { setAuth } = useContext(authContext);
  const { loading, globalError, validateAndSendForm } = useForm();

  const [name, setName] = useState({
    value: "",
    hasTyped: false,
    error: "default",
  });

  const [email, setEmail] = useState({
    value: "",
    hasTyped: false,
    error: "default",
  });

  const [password, setPassword] = useState({
    value: "",
    hasTyped: false,
    error: "default",
  });

  const [confirmPassword, setConfirmPassword] = useState({
    value: "",
    hasTyped: false,
    error: "default",
  });

  function changeMode(e) {
    e.preventDefault();

    // If already sending a req, don't let the user change mode
    if (loading) {
      return;
    }

    if (mode === "signup") {
      return setMode("signin");
    }

    setMode("signup");
  }

  function submitForm(e) {
    e.preventDefault();

    if (mode === "signin") {
      validateAndSendForm(
        [email, password],
        `${process.env.REACT_APP_API_DOMAIN}auth/login`,
        { email: email.value, password: password.value },
        (err, data) => {
          if (err) {
            return console.log(err);
          }

          localStorage.setItem("auth-token", data.token);
          localStorage.setItem("user-id", data.user.user_id);
          setAuth({
            isAuth: true,
            token: data.token,
            user: { name: data.user.name, email: data.user.email, cart: data.user.cart, is_admin: data.user.is_admin, id: data.user.user_id },
          });
        },
        { file: false }
      );
    } else {
      validateAndSendForm(
        [email, password],
        `${process.env.REACT_APP_API_DOMAIN}auth/signup`,
        { name: name.value, email: email.value, password: password.value, confirmpassword: confirmPassword.value },
        (err, data) => {
          if (err) {
            return console.log(err);
          }

          setMode("signin");
        },
        { file: false }
      );
    }
  }

  return (
    <form>
      <h2 className="header">{mode === "signup" ? "Create your account" : "Log in to your account"}</h2>
      <p className="lead">
        {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
        <button className="form-link" onClick={(e) => changeMode(e)}>
          {mode === "signup" ? "Sign in" : "Sign up"}
        </button>
      </p>
      {mode === "signup" && <Input label="name" placeholder="John doe..." type="text" value={name} setValue={setName} validate={nameValidate} />}
      <Input label="email" placeholder="email@email.com..." type="email" value={email} setValue={setEmail} validate={emailValidate} />
      <Input label="password" placeholder="StrongPassword..." type="password" value={password} setValue={setPassword} validate={passwordValidate} />
      {mode === "signup" && (
        <Input
          label="confirm password"
          placeholder="StrongPassword..."
          type="password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          validate={passwordValidate}
        />
      )}
      <Button onClick={(e) => submitForm(e)} className="submit-form">
        {mode === "signup" && loading ? <p className="loading">Signing up</p> : <p></p>}
        {mode === "signup" && !loading ? <p>Sign up</p> : <p></p>}

        {mode === "signin" && loading ? <p className="loading">Signing in</p> : <p></p>}
        {mode === "signin" && !loading ? <p>Sign in</p> : <p></p>}
        <i className="fas fa-arrow-right"></i>
      </Button>
      {mode === "signin" && (
        <p className="forgot-pass">
          Forgot password?{" "}
          <button className="form-link" onClick={(e) => changeMode(e)}>
            Reset here
          </button>
        </p>
      )}
      <p className="error-text" style={globalError === undefined ? { visibility: "hidden" } : mode === "signin" ? { textAlign: "center" } : {}}>
        *{globalError}
      </p>
    </form>
  );
}
