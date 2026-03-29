import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./layout/Base.css";
import "bootstrap/dist/css/bootstrap.min.css";



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  </React.StrictMode>
);
