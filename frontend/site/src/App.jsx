import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Carrito from "./pages/Carrito.jsx";
import Mapa from "./pages/Mapa.jsx";
import Sucursales from "./pages/Sucursales.jsx";
import Facturacion from "./pages/Facturacion.jsx";
import Preview from "./pages/Preview.jsx";
import DsPreview from "./pages/DsPreview.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/mapa" element={<Mapa />} />
      <Route path="/sucursales" element={<Sucursales />} />
      <Route path="/facturacion" element={<Facturacion />} />
      <Route path="/preview" element={<Preview />} />
      <Route path="/ds-preview" element={<DsPreview />} />
    </Routes>
  );
}
