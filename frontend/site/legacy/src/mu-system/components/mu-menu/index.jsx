import React from "react";
import "./styles.css";

export default function MUMenu() {
  const items = [
    {
      name: "Elote Montado",
      description: "Cocción tradicional con tequesquite. Montado al momento con mayonesa calibrada, queso premium y toppings estandarizados.",
      badge: "Producto Insignia",
    },
    {
      name: "Esquites Salteados",
      description: "Receta profesional con manteca, epazote y sofrito equilibrado. Textura jugosa y consistente diseñada para servicio rápido.",
      badge: "Receta Profesional",
    },
    {
      name: "Panqué de Elote",
      description: "Elote criollo, pinole azul y crema de piloncillo. Repostería de origen en formato fast-casual.",
      badge: "Signature Dessert",
    }
  ];

  return (
    <section className="mu-menu">
      <div className="mu-menu-container">
        <h2 className="mu-menu-title">Nuestro menú</h2>
        <p className="mu-menu-subtitle">
          Tres productos base. Una experiencia de identidad mexicana elevada al estándar fast-casual internacional.
        </p>

        <div className="mu-menu-grid">
          {items.map((item) => (
            <div key={item.name} className="mu-menu-card">
              <span className="mu-menu-badge">{item.badge}</span>
              <h3 className="mu-menu-item-title">{item.name}</h3>
              <p className="mu-menu-item-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
