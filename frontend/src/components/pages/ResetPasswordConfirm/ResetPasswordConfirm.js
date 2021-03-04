import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { passwordValidate } from "../../../validators";
import Input from "../Profile/Input";
import Button from "../../Button/Button";
import useForm from "../../../hooks/useForm";

export default function ResetPassword() {
  const { loading, globalError, validateAndSendForm } = useForm();
  const [successMessage, setSuccessMessage] = useState(undefined);

  const { tokenid } = useParams();
  const { user_id } = useParams();

  const [newpassword, setNewPassword] = useState({
    value: "",
    hasTyped: false,
    error: "default",
  });

  function submitForm(e) {
    e.preventDefault();

    validateAndSendForm(
      [newpassword],
      `${process.env.REACT_APP_API_DOMAIN}auth/reset/new-password`,
      {
        newpassword: newpassword.value,
        user_id,
        token: tokenid,
      },
      (err, data) => {
        if (err) {
          return console.log(err);
        }

        return setSuccessMessage(
          <p style={{ display: "inline", fontWeight: 900, color: "#000" }}>
            Password changed. Login <a href="/profile">here</a>
          </p>
        );
      },
      {
        enableTyped: true,
        file: false,
      }
    );
  }

  return (
    <main className="page-center">
      <form>
        <h2 className="header">Reset password</h2>
        <p className="lead">Enter your new password.</p>
        <Input
          label="password"
          placeholder="astrongpassword..."
          type="password"
          value={newpassword}
          setValue={setNewPassword}
          validate={passwordValidate}
        />
        <Button onClick={(e) => submitForm(e)} className="submit-form">
          {loading ? <p className="loading">Changing password</p> : <p>Change password</p>}
        </Button>
        <p className="error-text" style={globalError === undefined ? { visibility: "hidden" } : {}}>
          *{globalError}
        </p>
        <p className="success-text" style={successMessage === undefined ? { display: "none" } : {}}>
          *{successMessage}
        </p>
      </form>
    </main>
  );
}
