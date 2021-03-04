import React, { useContext, useState } from "react";
import { emailValidate } from "../../../validators";
import Input from "../Profile/Input";
import Button from "../../Button/Button";
import AuthContext from "../../../AuthContext";
import useForm from "../../../hooks/useForm";

export default function ResetPassword() {
  const { auth } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState(undefined);
  const { loading, globalError, validateAndSendForm } = useForm();

  const [email, setEmail] = useState({
    value: "",
    hasTyped: false,
    error: "default",
  });

  function submitForm(e) {
    e.preventDefault();

    validateAndSendForm(
      [email],
      `${process.env.REACT_APP_API_DOMAIN}auth/reset`,
      {
        email: email.value,
      },
      (err, data) => {
        if (err) {
          return console.log(err);
        }

        return setSuccessMessage("Email sent. Open link to reset password.");
      },
      {
        enableTyped: true,
        file: false,
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
  }

  return (
    <main className="page-center">
      <form>
        <h2 className="header">Reset password</h2>
        <p className="lead">A reset link will be emailed to you.</p>
        <Input label="email" placeholder="email@email.com..." type="email" value={email} setValue={setEmail} validate={emailValidate} />
        <Button onClick={(e) => submitForm(e)} className="submit-form">
          {loading ? <p className="loading">Sending recovery link</p> : <p>Send recovery link</p>}
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
