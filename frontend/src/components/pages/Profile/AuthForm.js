import React, { useState, useContext } from "react";
import Input from "./Input";
import Button from "../../Button/Button";
import authContext from "../../../AuthContext";
import axios from "axios";

import "./AuthForm.css";

export default function AuthForm() {
  const [mode, setMode] = useState("signup");
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState(undefined);
  const { setAuth } = useContext(authContext);

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
      return setGlobalError("Cannot change mode while sending request");
    }

    if (mode === "signup") {
      return setMode("signin");
    }

    setMode("signup");
  }

  function submitForm(e) {
    e.preventDefault();

    // Dont let user send new req/resubmit form is already sending
    if (loading) {
      return;
    }

    // Fields present in both modes
    if (!email.hasTyped || !password.hasTyped) {
      return setGlobalError("Form not filled in");
    }

    if (email.error !== "default" || password.error !== "default") {
      return setGlobalError("Form invalid");
    }

    // Signup specific
    if (mode === "signup") {
      if (!name.hasTyped || !confirmPassword.hasTyped) {
        return setGlobalError("Form not filled in");
      }

      if (name.error !== "default" || confirmPassword.error !== "default") {
        return setGlobalError("Form invalid");
      }

      if (password.value !== confirmPassword.value) {
        return setGlobalError("Passwords don't match");
      }
    }

    // Form is now valid, set loading state while sending request to backend
    setLoading(true);

    // Sign user up
    if (mode === "signup") {
    } else {
      // Sign in user
      axios
        .post(`${process.env.REACT_APP_API_DOMAIN}auth/login`, {
          email: email.value,
          password: password.value,
        })
        .then((response) => {
          const data = response.data;

          localStorage.setItem("user_id", response.data.user.user_id);
          setAuth({ isAuth: true, user: { name: data.user.name, cart: data.user.cart, is_admin: data.user.is_admin, id: data.user.user_id } });
        })
        .catch((error) => {
          const response = error.response;
          setLoading(false);
          setGlobalError(response.data.error_message);
        });
    }
  }

  return (
    <form className="auth-form">
      <h2 className="header">{mode === "signup" ? "Create your account" : "Log in to your account"}</h2>
      <p className="lead">
        {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
        <button className="form-link" onClick={(e) => changeMode(e)}>
          {mode === "signup" ? "Sign in" : "Sign up"}
        </button>
      </p>
      {mode === "signup" && <Input label="name" placeholder="John doe..." type="text" value={name} setValue={setName} />}
      <Input label="email" placeholder="email@email.com..." type="email" value={email} setValue={setEmail} />
      <Input label="password" placeholder="StrongPassword..." type="password" value={password} setValue={setPassword} />
      {mode === "signup" && (
        <Input label="confirm password" placeholder="StrongPassword..." type="password" value={confirmPassword} setValue={setConfirmPassword} />
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
