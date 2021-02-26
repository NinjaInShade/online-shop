import React, { useContext } from "react";
import AuthForm from "./AuthForm";
import authContext from "../../../AuthContext";

import "./Profile.css";

export default function Profile() {
  const { auth, setAuth } = useContext(authContext);

  if (auth.isAuth) {
    return (
      <main className="profile-main">
        <h1>Welcome to your profile</h1>
      </main>
    );
  }

  return (
    <main className="profile-main">
      <AuthForm />
    </main>
  );
}
