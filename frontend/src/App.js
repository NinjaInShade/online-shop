import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar/Navbar";
import Unmatched from "./components/pages/Unmatched/Unmatched";
import ProductsList from "./components/pages/ProductsList/ProductsList";
import Profile from "./components/pages/Profile/Profile";
import AuthContext from "./AuthContext";

import "./App.css";

function App() {
  const [auth, setAuth] = useState({
    isAuth: false,
    user: {
      name: undefined,
      user_id: undefined,
      cart: undefined,
      is_admin: undefined,
    },
  });

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");

    if (user_id) {
      axios
        .get(`${process.env.REACT_APP_API_DOMAIN}user/${user_id}`)
        .then((response) => {
          const data = response.data;

          setAuth({ isAuth: true, user: { name: data.user.name, cart: data.user.cart, is_admin: data.user.is_admin, id: data.user.user_id } });
        })
        .catch((error) => {
          return console.log(error);
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact>
            <ProductsList admin={false} />
          </Route>
          <Route path="/products" exact>
            <ProductsList admin={false} />
          </Route>
          <Route path="/profile" exact>
            <Profile />
          </Route>
          <Route path="/admin/products" exact>
            <ProductsList admin={true} />
          </Route>
          <Route>
            <Unmatched />
          </Route>
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
