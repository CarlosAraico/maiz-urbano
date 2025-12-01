import React, { useMemo, useState } from "react";
import heroImg from "../../../assets/hero.jpg";
import eloteImg from "../../../assets/elote-montado.jpg";
import esquitesImg from "../../../assets/esquites.jpg";
import panqueImg from "../../../assets/panque-elote.jpg";
import logo from "../../../assets/Logo Original Maiz Urbano.png";

const TAX_RATE = 0.16;

const products = [
  {
    id: "elote",
    name: "Elote entero montado",
    basePrice: 55,
    img: eloteImg,
    description: "Elote criollo hervido en tequesquite, montado con mantequilla y toppings.",
    variants: [
      { id: "original", label: "Original", delta: 0 },
      { id: "chipotle", label: "Ahumado chipotle", delta: 6, tag: "Recomendado" },
      { id: "manzano", label: "Frutal manzano", delta: 6 },
      { id: "habanero", label: "Valientes habanero", delta: 8, tag: "🔥" },
      { id: "macha", label: "Crunch macha", delta: 8 }
    ]
  },
  {
    id: "esquites",
    name: "Esquites salteados",
    basePrice: 48,
    img: esquitesImg,
    description: "Grano sofrito con epazote y caldo, servido por vaso con toppings.",
    variants: [
      { id: "original", label: "Original", delta: 0, tag: "Más vendido" },
      { id: "chipotle", label: "Ahumado chipotle", delta: 5 },
      { id: "manzano", label: "Frutal manzano", delta: 5 },
      { id: "habanero", label: "Valientes habanero", delta: 7 },
      { id: "macha", label: "Crunch macha", delta: 7 }
    ]
  },
  {
    id: "panque",
    name: "Panqué de elote con pinole",
    basePrice: 38,
    img: panqueImg,
    description: "Porción individual, crema de piloncillo y pinole de maíz criollo.",
    variants: [{ id: "clasico", label: "Clásico", delta: 0, tag: "Postre" }]
  }
];

const extras = [
  { id: "queso", label: "Queso extra", price: 6 },
  { id: "limon", label: "Limón extra", price: 0 },
  { id: "chapulines", label: "Chapulines", price: 15, tag: "Premium" },
  { id: "sal-hormiga", label: "Sal de hormiga", price: 12, tag: "Premium" },
  { id: "salsa", label: "Shot de salsa extra", price: 5 }
];

const contacts = [
  { label: "Fernando Palacio", value: "5521180848" },
  { label: "Carlos Araico", value: "7772168377" }
];

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b border-color-border sticky top-0 z-50 bg-color-bg/90 backdrop-blur">
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={logo} alt="Maíz Urbano" style={{ height: 42, width: "auto", objectFit: "contain" }} />
          <div className="font-heading text-md">Maíz Urbano</div>
        </div>
        <nav className="hidden md:flex" style={{ gap: 16 }}>
          <a href="#home">Inicio</a>
          <a href="#productos">Productos</a>
          <a href="#carrito">Carrito</a>
          <a href="#franquicias">Franquicias</a>
          <a href="#impacto">Impacto</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <button className="btn" style={{ padding: "10px 14px" }} onClick={() => setOpen(!open)}>
          Menú
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-color-border bg-color-bg">
          <div className="container" style={{ display: "flex", flexDirection: "column", gap: 12, padding: "12px 0" }}>
            <a href="#home" onClick={() => setOpen(false)}>Inicio</a>
            <a href="#productos" onClick={() => setOpen(false)}>Productos</a>
            <a href="#carrito" onClick={() => setOpen(false)}>Carrito</a>
            <a href="#franquicias" onClick={() => setOpen(false)}>Franquicias</a>
            <a href="#impacto" onClick={() => setOpen(false)}>Impacto</a>
            <a href="#contacto" onClick={() => setOpen(false)}>Contacto</a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="section" style={{ paddingTop: 80 }}>
      <div className="container grid" style={{ gap: 32, gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}>
        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-color-primary">Corn Revolution · Urbano</p>
          <h1 className="font-heading text-4xl" style={{ lineHeight: 1.1 }}>
            Tradición criolla + innovación urbana.
          </h1>
          <p className="text-md opacity-90">
            Elotes, esquites y panqués que honran la tierra con operación estandarizada y lista para escalar.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a className="btn" href="#carrito">Armar pedido</a>
            <a className="btn secondary" href="#franquicias">Quiero franquiciar</a>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", color: "var(--color-text)", opacity: 0.9 }}>
            <span className="badge">Producto montado al momento</span>
            <span className="badge">Triple impacto</span>
          </div>
        </div>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <img src={heroImg} alt="Hero maíz urbano" style={{ width: "100%", height: "100%", objectFit: "cover", maxHeight: 420 }} />
        </div>
      </div>
    </section>
  );
}

function Products() {
  return (
    <section id="productos" className="section">
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-color-primary">Productos estrella</p>
            <h2 className="font-heading text-2xl">El lienzo + sabores</h2>
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
          {products.map((p) => (
            <article key={p.id} className="card" style={{ display: "grid", gap: 12 }}>
              <img src={p.img} alt={p.name} style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 12, border: "1px solid var(--border)" }} />
              <div className="font-heading text-lg">{p.name}</div>
              <p className="text-sm opacity-85">{p.description}</p>
              <div className="pill" style={{ width: "fit-content" }}>
                <span>Desde</span>
                <strong>${p.basePrice}</strong>
              </div>
              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))" }}>
                {p.variants.map((v) => (
                  <div key={v.id} className="badge" style={{ justifyContent: "space-between", width: "100%" }}>
                    <span>{v.label}</span>
                    {v.delta > 0 && <span>+${v.delta}</span>}
                    {v.tag && <span>{v.tag}</span>}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cart() {
  const [selected, setSelected] = useState({ product: "elote", variant: "original", qty: 1, extras: [] });
  const product = useMemo(() => products.find((p) => p.id === selected.product), [selected.product]);
  const variant = useMemo(() => product?.variants.find((v) => v.id === selected.variant), [product, selected.variant]);

  const basePrice = product?.basePrice || 0;
  const variantDelta = variant?.delta || 0;
  const extrasTotal = selected.extras.reduce((acc, id) => {
    const ex = extras.find((e) => e.id === id);
    return acc + (ex?.price || 0);
  }, 0);
  const unitPrice = basePrice + variantDelta + extrasTotal;
  const subtotal = unitPrice * selected.qty;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const toggleExtra = (id) => {
    setSelected((prev) => ({
      ...prev,
      extras: prev.extras.includes(id) ? prev.extras.filter((e) => e !== id) : [...prev.extras, id]
    }));
  };

  return (
    <section id="carrito" className="section">
      <div className="container grid" style={{ gap: 24, gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}>
        <div className="card" style={{ display: "grid", gap: 16 }}>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-color-primary">Carrito</p>
            <h2 className="font-heading text-2xl">Arma tu pedido</h2>
            <p className="text-sm opacity-85">Montamos al momento. Todos los gramajes están estandarizados.</p>
          </div>

          <label className="text-sm">Producto base</label>
          <select
            value={selected.product}
            onChange={(e) => setSelected({ ...selected, product: e.target.value, variant: "original", extras: [] })}
            style={{ padding: 12, borderRadius: 10, border: "1px solid var(--border)", background: "var(--color-bg)", color: "var(--color-text)" }}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — ${p.basePrice}
              </option>
            ))}
          </select>

          <label className="text-sm">Variante / perfil de sabor</label>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))" }}>
            {product?.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelected((prev) => ({ ...prev, variant: v.id }))}
                className="card"
                style={{
                  borderColor: selected.variant === v.id ? "var(--color-primary)" : "var(--border)",
                  background: selected.variant === v.id ? "color-mix(in srgb, var(--color-primary) 12%, var(--color-bg))" : "var(--color-bg)",
                  textAlign: "left"
                }}
              >
                <div className="font-heading text-sm">{v.label}</div>
                <div className="text-xs opacity-80">{v.delta > 0 ? `+ $${v.delta}` : "Incluido"}</div>
                {v.tag && <div className="badge" style={{ marginTop: 6 }}>{v.tag}</div>}
              </button>
            ))}
          </div>

          <label className="text-sm">Extras</label>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))" }}>
            {extras.map((ex) => (
              <label key={ex.id} className="card" style={{ display: "grid", gap: 6, cursor: "pointer", borderColor: selected.extras.includes(ex.id) ? "var(--color-primary)" : "var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="font-heading text-sm">{ex.label}</span>
                  <input
                    type="checkbox"
                    checked={selected.extras.includes(ex.id)}
                    onChange={() => toggleExtra(ex.id)}
                    style={{ accentColor: "var(--color-primary)" }}
                  />
                </div>
                <div className="text-xs opacity-80">{ex.price > 0 ? `+$${ex.price}` : "Incluido"}</div>
                {ex.tag && <div className="badge">{ex.tag}</div>}
              </label>
            ))}
          </div>

          <label className="text-sm">Cantidad</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="btn secondary" onClick={() => setSelected((p) => ({ ...p, qty: Math.max(1, p.qty - 1) }))} style={{ width: 44, justifyContent: "center" }}>
              −
            </button>
            <div className="card" style={{ padding: "10px 16px", minWidth: 64, textAlign: "center" }}>{selected.qty}</div>
            <button className="btn secondary" onClick={() => setSelected((p) => ({ ...p, qty: p.qty + 1 }))} style={{ width: 44, justifyContent: "center" }}>
              +
            </button>
          </div>
        </div>

        <div className="card" style={{ display: "grid", gap: 12, alignContent: "start" }}>
          <h3 className="font-heading text-xl">Resumen</h3>
          <div className="badge" style={{ width: "fit-content" }}>Producto montado al momento</div>
          <div className="card" style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <img src={product?.img} alt={product?.name} style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 12, border: "1px solid var(--border)" }} />
            <div>
              <div className="font-heading text-md">{product?.name}</div>
              <div className="text-sm opacity-80">Variante: {variant?.label}</div>
              <div className="text-sm opacity-80">Extras: {selected.extras.length ? selected.extras.join(", ") : "Sin extras"}</div>
            </div>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "1fr auto", rowGap: 6 }}>
            <span className="opacity-80">Precio base</span>
            <span>${basePrice.toFixed(2)}</span>
            <span className="opacity-80">Variante</span>
            <span>${variantDelta.toFixed(2)}</span>
            <span className="opacity-80">Extras</span>
            <span>${extrasTotal.toFixed(2)}</span>
            <span className="opacity-80">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
            <span className="opacity-80">IVA (16%)</span>
            <span>${tax.toFixed(2)}</span>
            <strong>Total</strong>
            <strong>${total.toFixed(2)}</strong>
          </div>
          <div className="badge">Pagos seguros · Entrega inmediata en punto de venta</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn" style={{ flex: 1, minWidth: 180 }}>Pagar ahora</button>
            <button className="btn secondary" style={{ flex: 1, minWidth: 180 }}>Guardar pedido</button>
          </div>
          <p className="text-xs opacity-70">* Chapulines y sal de hormiga se montan al final para mantener el crunch.</p>
        </div>
      </div>
    </section>
  );
}

function Franchise() {
  return (
    <section id="franquicias" className="section">
      <div className="container grid" style={{ gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-color-primary">Franquicias</p>
          <h2 className="font-heading text-2xl">Modelo replicable</h2>
          <p className="opacity-85">Centro de producción → logística en frío → módulos de 6 m². SOP, capacitación y tokens sincronizados.</p>
        </div>
        <div className="card">
          <h3 className="font-heading text-md">Beneficios</h3>
          <ul style={{ paddingLeft: 18, margin: "8px 0", lineHeight: 1.6 }}>
            <li>Márgenes altos en antojitos (60-70%).</li>
            <li>Estandarización y control de calidad.</li>
            <li>Marca diferenciada, identidad criolla urbana.</li>
            <li>Soporte continuo y capacitación.</li>
          </ul>
        </div>
        <div className="card">
          <h3 className="font-heading text-md">Fases</h3>
          <ol style={{ paddingLeft: 18, margin: "8px 0", lineHeight: 1.6 }}>
            <li>Consolidación local (2-3 módulos).</li>
            <li>Expansión regional (8-10 puntos + B2B).</li>
            <li>Licencias/franquicias nacionales.</li>
            <li>Línea empacada a retail.</li>
          </ol>
        </div>
      </div>
    </section>
  );
}

function Impact() {
  return (
    <section id="impacto" className="section">
      <div className="container grid" style={{ gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-color-primary">Impacto</p>
          <h2 className="font-heading text-2xl">Triple impacto</h2>
        </div>
        <div className="card">
          <h3 className="font-heading text-md">Sostenibilidad</h3>
          <p className="opacity-85">Empaques en totomoxtle compostable, agua de cocción reutilizada.</p>
        </div>
        <div className="card">
          <h3 className="font-heading text-md">Trazabilidad</h3>
          <p className="opacity-85">Lotes identificados por proveedor y región, control de origen criollo.</p>
        </div>
        <div className="card">
          <h3 className="font-heading text-md">Productores</h3>
          <p className="opacity-85">Compras directas a Tlaxcala (Altzayanca, Ixtenco, Huamantla) a precio justo.</p>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contacto" className="section">
      <div className="container grid" style={{ gap: 24, gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}>
        <div className="card">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-color-primary">Contacto</p>
          <h2 className="font-heading text-2xl">Conversemos</h2>
          <p className="opacity-85">CEDIS: Andes 91, Los Alpes, Álvaro Obregón, 01010 Ciudad de México, CDMX.</p>
          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            {contacts.map((c) => (
              <div key={c.value} className="badge">{c.label}: {c.value}</div>
            ))}
          </div>
          <a className="btn" style={{ marginTop: 12 }} href="mailto:hola@maizurbano.mx">Enviar correo</a>
        </div>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <iframe
            title="Mapa CEDIS Maíz Urbano"
            width="100%"
            height="320"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src="https://www.google.com/maps?q=Andes%2091,%20Los%20Alpes,%20%C3%81lvaro%20Obreg%C3%B3n,%2001010%20Ciudad%20de%20M%C3%A9xico&output=embed"
          ></iframe>
          <div style={{ padding: 12 }} className="text-sm opacity-80">
            <a href="https://maps.app.goo.gl/Wjdi4maQyvwR4jUj8" target="_blank" rel="noreferrer">Abrir en Google Maps</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Products />
      <Cart />
      <Franchise />
      <Impact />
      <Contact />
    </>
  );
}
