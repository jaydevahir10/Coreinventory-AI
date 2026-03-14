import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import Stock from "./pages/Stock";
import Login from "./pages/Login";

function App() {

  const isAuth = localStorage.getItem("auth");

  if (!isAuth) {
    return <Login />;
  }

  return (
    <BrowserRouter>

      <Sidebar />

      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/add" element={<AddProduct />} />

        <Route path="/stock" element={<Stock />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;