import React from "react";

const AuthContext = React.createContext({ auth: { isAuth: false, user: undefined }, setAuth: (auth) => {} });

export default AuthContext;
