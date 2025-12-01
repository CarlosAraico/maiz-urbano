import React from "react";
import "./styles.css";

export default function MUEmpleo() {
  return (
    <section className="mu-empleo">
      <div className="mu-empleo-container">
        <h2 className="mu-empleo-title">Oportunidades laborales</h2>
        <p className="mu-empleo-subtitle">
          Construimos equipos fuertes, operativos y con sentido de identidad.  
          Buscamos talento para liderar sucursales, producción y operación fast-casual.
        </p>

        <div className="mu-empleo-grid">
          <div className="mu-empleo-card">
            <h3>Operador de Sucursal</h3>
            <p>Servicio al cliente, montaje, operación en línea y estándares MU.</p>
          </div>

          <div className="mu-empleo-card">
            <h3>Líder de Punto</h3>
            <p>Gestión de personal, métricas operativas y control de turno.</p>
          </div>

          <div className="mu-empleo-card">
            <h3>Producción Central</h3>
            <p>Elaboración técnica con recetas calibradas y control de calidad.</p>
          </div>
        </div>

        <a href="#contacto" className="mu-empleo-cta">Aplicar ahora</a>
      </div>
    </section>
  );
}
