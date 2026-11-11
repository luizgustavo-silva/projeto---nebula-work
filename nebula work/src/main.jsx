import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.module.css'
import Home from "./pages/Home/Home.jsx"
import Career from "./pages/career/Career.jsx"
import Empresas from "./pages/Empresas/Empresas.jsx"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/carreiras" element={<Career/>}/>
        <Route path="/empresas" element={<Empresas/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
