import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import "./index.module.css";

import Home from "./pages/Home/Home.jsx";
import Career from "./pages/career/Career.jsx";
import Empresas from "./pages/Empresas/Empresas.jsx";
import EmpresaDetalhes from "./pages/Empresas/EmpresaDetalhes.jsx";
import Menu from "./components/Menu/Menu.jsx";
import Login from "./pages/Login/Login.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Cursos from "./pages/cursos/Cursos.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carreiras" element={<Career />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/empresas/:empresaId" element={<EmpresaDetalhes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Profile />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
