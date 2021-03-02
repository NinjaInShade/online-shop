import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../AuthContext";

import "./OrderTable.css";

export default function OrderTable() {
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState();

  const { auth } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_DOMAIN}orders`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((response) => {
        const data = response.data;

        setTotalPrice(data.total_price);
        setOrders(
          data.orders.map((order) => {
            // Format mongoose default created_at time.
            const d = new Date(order.created_at);
            const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
            const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
            const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
            return { ...order, created_at: `${da} ${mo} ${ye}` };
          })
        );
      })
      .catch((error) => {
        return console.log(error);
      });
  }, [auth.token]);

  function get_invoice(order_id) {
    axios({
      url: `${process.env.REACT_APP_API_DOMAIN}orders/${order_id}`,
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "invoice.pdf"); //or any other extension
        document.body.appendChild(link);
        link.click();
        console.log(response);
      })
      .catch((error) => {
        return console.log(error);
      });
  }

  return (
    <div className="orders-container">
      <table className="orders">
        <thead>
          <tr className="orders-header">
            <th colSpan="1"></th>
            <th colSpan="1" className="order-id">
              Order #
            </th>
            <th colSpan="1" className="created-at">
              Data ordered
            </th>
            <th colSpan="5" className="shipped-status">
              Status
            </th>
            <th colSpan="1" className="items">
              # of items
            </th>
            <th colSpan="1" className="order-total-price">
              Total price
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => {
            return (
              <tr key={index}>
                <td className="invoice-container flex">
                  <span className="material-icons invoice" onClick={() => get_invoice(order._id)}>
                    get_app
                  </span>
                </td>
                <td className="order-id">{order._id}</td>
                <td className="created-at">{order.created_at}</td>
                <td colSpan="5" className="shipped-status">
                  <span className="material-icons">fiber_manual_record</span>
                  Not shipped
                </td>
                <td className="items">{order.products.length}</td>
                <td className="order-total-price">£{totalPrice}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
