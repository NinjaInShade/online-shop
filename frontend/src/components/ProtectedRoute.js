import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "../AuthContext";

export default function ProtectedRoute({ path, exact, component }) {
  const { auth } = useContext(AuthContext);

  return auth.isAuth ? (
    <Route path={path} exact={exact}>
      {component}
    </Route>
  ) : (
    <Redirect to="/profile" />
  );
}
