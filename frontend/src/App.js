import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Unmatched from "./components/pages/Unmatched/Unmatched";
import Shop from "./components/pages/Shop/Shop";

import "./App.css";

function App() {
  return (
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
  );
}

export default App;
