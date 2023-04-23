import React from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Home, About } from "./App";

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
