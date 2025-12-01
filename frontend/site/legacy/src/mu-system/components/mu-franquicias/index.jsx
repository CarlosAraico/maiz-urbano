import React from "react";
import "./styles.css";

export default function MUFranquicias() {
  const bullets = [
    "Modelo replicable con SOP estandarizados",
    "Recetas calibradas y fichas técnicas certificadas",
    "Margen bruto promedio del 65–70%",
    "Tiempos operativos de 90 segundos por servicio",
    "Producción centralizada opcional para escalabilidad"
  ];

  return (
    <section className="mu-franquicias">
      <div className="mu-franquicias-container">
        <h2 className="mu-franquicias-title">Modelo de franquicias</h2>
        <p className="mu-franquicias-subtitle">
          Operación estandarizada, procesos replicables y un sistema diseñado para crecer en múltiples mercados urbanos.
        </p>

        <ul className="mu-franquicias-list">
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>

        <a href="#contacto" className="mu-franquicias-cta">
          Solicitar información
        </a>
      </div>
    </section>
  );
}
