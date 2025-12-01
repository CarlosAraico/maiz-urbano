import { Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Carrito from "./Carrito.jsx";
import Facturacion from "./Facturacion.jsx";
import Mapa from "./Mapa.jsx";
import Preview from "./Preview.jsx";
import DsPreview from "./DsPreview.jsx";
import Sucursales from "./Sucursales.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/facturacion" element={<Facturacion />} />
      <Route path="/mapa" element={<Mapa />} />
      <Route path="/preview" element={<Preview />} />
      <Route path="/ds-preview" element={<DsPreview />} />
      <Route path="/sucursales" element={<Sucursales />} />
    </Routes>
  );
}
