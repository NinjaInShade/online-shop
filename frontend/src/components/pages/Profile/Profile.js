import React, { useContext } from "react";
import AuthForm from "./AuthForm";
import authContext from "../../../AuthContext";

export default function Profile() {
  const { auth, setAuth } = useContext(authContext);

  if (auth.isAuth) {
    return (
      <main className="page-center">
        <h1>Welcome to your profile</h1>
      </main>
    );
  }

  return (
    <main className="page-center">
      <AuthForm />
    </main>
  );
}
