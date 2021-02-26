import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Unmatched from "./components/pages/Unmatched/Unmatched";
import Shop from "./components/pages/Shop/Shop";
import AuthContext from "./AuthContext";

import "./App.css";

function App() {
  const [auth, setAuth] = useState({
    isAuth: true,
    user: {
      isAdmin: true,
    },
  });

  useEffect(() => {
    // Fetch user data
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact>
            <Shop />
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
