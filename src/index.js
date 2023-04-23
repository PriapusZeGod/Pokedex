import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { RouterProvider } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/:pokemonId",
    element: <About />,
  },
]);
root.render(
  //<React.StrictMode>
  <RouterProvider />
  //</React.StrictMode>
);
