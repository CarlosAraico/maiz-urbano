import React from "react";
import "./styles.css";

export default function MUSucursales() {
  const locations = [
    { name: "Roma Norte", status: "Operación piloto" },
    { name: "Condesa", status: "Próxima apertura" },
    { name: "Satélite", status: "En validación" }
  ];

  return (
    <section className="mu-sucursales">
      <div className="mu-sucursales-container">
        <h2 className="mu-sucursales-title">Nuestras sucursales</h2>
        <p className="mu-sucursales-subtitle">
          Expansión estratégica en zonas urbanas clave.
        </p>

        <div className="mu-sucursales-grid">
          {locations.map((loc) => (
            <div key={loc.name} className="mu-sucursales-card">
              <h3>{loc.name}</h3>
              <p>{loc.status}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
