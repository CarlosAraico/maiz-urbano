import React from "react";
import "./styles.css";

export default function MUFooter() {
  return (
    <footer className="mu-footer">
      <div className="mu-footer-container">
        <h3 className="mu-footer-brand">Maíz Urbano</h3>

        <div className="mu-footer-columns">
          <div>
            <h4>Empresa</h4>
            <a href="#mu-franquicias">Franquicias</a>
            <a href="#mu-empleo">Empleo</a>
          </div>

          <div>
            <h4>Producto</h4>
            <a href="#mu-menu">Menú</a>
            <a href="#mu-sucursales">Sucursales</a>
          </div>

          <div>
            <h4>Contacto</h4>
            <a href="#">Mensaje directo</a>
            <a href="#">Redes sociales</a>
          </div>
        </div>

        <p className="mu-footer-copy">© {new Date().getFullYear()} Maíz Urbano. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
