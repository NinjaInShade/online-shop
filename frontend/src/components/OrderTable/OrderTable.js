import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../AuthContext";

export default function OrderTable() {
  const [orders, setOrders] = useState([]);
  const { auth, setAuth } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_DOMAIN}orders`, {})
      .then((response) => {
        const data = response.data;

        console.log(data);
      })
      .catch((error) => {
        return console.log(error);
      });
  }, []);

  return (
    <table className="orders">
      <thead>
        <tr>
          <th colSpan="2">The table header</th>
        </tr>
      </thead>
    </table>
  );
}
