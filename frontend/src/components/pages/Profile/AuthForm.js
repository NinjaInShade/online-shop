import React, { useState } from "react";
import Input from "./Input";
import Button from "../../Button/Button";

import "./AuthForm.css";

export default function AuthForm() {
  const [mode, setMode] = useState("signup");
  const [globalError, setGlobalError] = useState(undefined);

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

    if (mode === "signup") {
      return setMode("signin");
    }

    setMode("signup");
  }

  function submitForm(e) {
    e.preventDefault();

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

    return setGlobalError("FORM VALID!");
  }

  return (
    <form className="auth-form">
      <h2 className="header">{mode === "signup" ? "Create your account" : "Log in to your account"}</h2>
      <p className="lead">
        Don't have an account?{" "}
        <button className="form-link" onClick={(e) => changeMode(e)}>
          Sign up
        </button>
      </p>
      {mode === "signup" && <Input label="name" placeholder="John doe..." type="text" value={name} setValue={setName} />}
      <Input label="email" placeholder="email@email.com..." type="email" value={email} setValue={setEmail} />
      <Input label="password" placeholder="StrongPassword..." type="password" value={password} setValue={setPassword} />
      {mode === "signup" && (
        <Input label="confirm password" placeholder="StrongPassword..." type="password" value={confirmPassword} setValue={setConfirmPassword} />
      )}
      <Button onClick={(e) => submitForm(e)} className="submit-form">
        Sign up
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
