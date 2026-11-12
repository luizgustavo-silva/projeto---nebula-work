import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Route, Routes } from "react-router";
import "./index.module.css";

import Home from "./pages/Home/Home.jsx";
import Career from "./pages/career/Career.jsx";
import Empresas from "./pages/Empresas/Empresas.jsx";
import Menu from "./components/Menu/Menu.jsx";
import Login from "./pages/Login/Login.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/carreiras" element={<Career />} />
        <Route path="/empresas" element={<Empresas />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
