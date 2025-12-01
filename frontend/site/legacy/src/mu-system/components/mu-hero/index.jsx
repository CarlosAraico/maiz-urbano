import React from "react";
import "./styles.css";

export default function MUHero() {
  return (
    <section className="mu-hero">
      <div className="mu-hero-bg" aria-hidden="true" />

      <div className="mu-hero-container">
        <p className="mu-hero-kicker">
          MAÍZ URBANO / FAST-CASUAL DE IDENTIDAD MEXICANA
        </p>

        <h1 className="mu-hero-title">
          El nuevo estándar de antojitos de maíz criollo.
        </h1>

        <p className="mu-hero-subtitle">
          Una marca mexicana de clase mundial que revaloriza el maíz criollo mediante 
          recetas profesionales, operación estandarizada y un modelo replicable para 
          ciudades globales. Elotes, esquites y panqués elevados a una experiencia 
          gastronómica moderna, eficiente y con trazabilidad completa.
        </p>

        <div className="mu-hero-actions">
          <a href="#mu-menu" className="mu-hero-cta">Explorar menú</a>
          <a href="#mu-franquicias" className="mu-hero-cta ghost">Modelo de franquicias</a>
          <a href="#mu-empleo" className="mu-hero-link">Oportunidades laborales</a>
        </div>

        <div className="mu-hero-tags">
          <span className="mu-hero-chip">Trazabilidad Criolla</span>
          <span className="mu-hero-chip">Cocina Estándar Pro</span>
          <span className="mu-hero-chip">Fast-Casual Moderno</span>
          <span className="mu-hero-chip">Listo para Expansión</span>
        </div>

        <div className="mu-hero-metrics">
          <div className="mu-hero-metric">
            <span className="mu-hero-metric-value">92%</span>
            <span className="mu-hero-metric-label">Consistencia operativa</span>
          </div>
          <div className="mu-hero-metric">
            <span className="mu-hero-metric-value">65–70%</span>
            <span className="mu-hero-metric-label">Margen bruto</span>
          </div>
          <div className="mu-hero-metric">
            <span className="mu-hero-metric-value">3</span>
            <span className="mu-hero-metric-label">Sucursales piloto</span>
          </div>
          <div className="mu-hero-metric">
            <span className="mu-hero-metric-value">90 s</span>
            <span className="mu-hero-metric-label">Tiempo de servicio</span>
          </div>
        </div>
      </div>
    </section>
  );
}
