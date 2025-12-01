set -euo pipefail

mkdir -p public
echo ">> Asegúrate de colocar assets:"
echo "   - /public/logo-mu.png  (logo sin fondo)"
echo "   - /public/mu-mascot.png (mascota)"

# -------- root package.json (workspaces + scripts) --------
cat > package.json <<'JSON'
{
  "name": "maiz-urbano-monorepo",
  "private": true,
  "workspaces": [
    "frontend/facturacion",
    "frontend/mu-mount"
  ],
  "scripts": {
    "bootstrap": "npm run -w frontend/facturacion ci && npm run -w frontend/mu-mount ci",
    "dev:facturacion": "vite --config frontend/facturacion/vite.config.js",
    "build:facturacion": "vite build --config frontend/facturacion/vite.config.js",
    "preview:facturacion": "vite preview --config frontend/facturacion/vite.config.js --port 5173",
    "dev:mu": "vite --config frontend/mu-mount/vite.config.js",
    "build:mu": "vite build --config frontend/mu-mount/vite.config.js",
    "test:e2e": "playwright test",
    "test:ci": "playwright test --reporter=list",
    "build": "npm run build:facturacion && npm run build:mu"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0",
    "vite": "^5.4.0"
  }
}
JSON

# -------- .gitignore básico --------
cat > .gitignore <<'GIT'
node_modules
dist
build
frontend/**/build
frontend/**/dist
*.local
.env
GIT

# -------- Playwright config + tests + CI --------
mkdir -p tests .github/workflows
cat > playwright.config.ts <<'TS'
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: 'tests',
  timeout: 60000,
  retries: 0,
  use: { baseURL: 'http://localhost:5173', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run preview:facturacion',
    url: 'http://localhost:5173/facturacion/login',
    reuseExistingServer: !process.env.CI
  }
});
TS

cat > tests/facturacion.smoke.spec.js <<'JS'
import { test, expect } from '@playwright/test';

test('login → solicitud → consulta → dashboard', async ({ page }) => {
  await page.goto('/facturacion/login');
  await expect(page.getByText('Acceso · Facturación')).toBeVisible();

  await page.getByLabel('Email').fill('tester@mu.mx');
  await page.getByLabel('Password').fill('123456');
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page.getByText('Solicitud de Factura')).toBeVisible();
  await page.getByLabel('RFC').fill('MUAX010101ABC');
  await page.getByLabel('Ticket').fill('123456');
  await page.getByLabel('Monto').fill('248.50');
  await page.getByRole('button', { name: 'Registrar Solicitud' }).click();
  await expect(page.getByText('Solicitud registrada. Folio:')).toBeVisible();

  await page.goto('/facturacion/consulta');
  await page.getByPlaceholder('RFC').fill('MUAX010101ABC');
  await page.getByPlaceholder('Ticket').fill('123456');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await expect(page.getByText('MUAX010101ABC')).toBeVisible();

  await page.goto('/facturacion/dashboard');
  await expect(page.getByText('Dashboard')).toBeVisible();
});
JS

cat > tests/ocr.mock.spec.js <<'JS'
import { test, expect } from '@playwright/test';

test('OCR mock: sube imagen y autocompleta', async ({ page }) => {
  await page.goto('/facturacion/login');
  await page.getByLabel('Email').fill('qa@mu.mx');
  await page.getByLabel('Password').fill('123456');
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page.getByText('Solicitud de Factura')).toBeVisible();
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByText('Subir ticket (OCR)').click();
  const chooser = await fileChooserPromise;
  await chooser.setFiles({ name: 'ticket.png', mimeType: 'image/png', buffer: Buffer.from([137,80,78,71]) });

  await expect(page.getByText('Datos capturados por OCR')).toBeVisible();
  await expect(page.getByLabel('RFC')).toHaveValue('MUAX010101ABC');
  await expect(page.getByLabel('Ticket')).toHaveValue('123456');
  await expect(page.getByLabel('Monto')).toHaveValue('248.5');
});
JS

cat > tests/kpi.persistence.spec.js <<'JS'
import { test, expect } from '@playwright/test';

test('KPIs persisten con 2 samples', async ({ page }) => {
  await page.goto('/facturacion/login');
  await page.getByLabel('Email').fill('kpi@mu.mx');
  await page.getByLabel('Password').fill('123456');
  await page.getByRole('button', { name: 'Entrar' }).click();

  for (let i = 0; i < 2; i++) {
    await page.getByLabel('RFC').fill('MUAX010101ABC');
    await page.getByLabel('Ticket').fill(String(100000 + i));
    await page.getByLabel('Monto').fill('100.00');
    await page.getByRole('button', { name: 'Registrar Solicitud' }).click();
    await expect(page.getByText('Solicitud registrada. Folio:')).toBeVisible();
  }

  await page.goto('/facturacion/dashboard');
  await expect(page.getByText('Dashboard')).toBeVisible();
  await expect(page.getByText('Total facturado')).toBeVisible();
  await expect(page.getByText('Solicitudes')).toBeVisible();
});
JS

cat > .github/workflows/ci.yml <<'YAML'
name: ci
on:
  push: { branches: [ main ] }
  pull_request: { branches: [ main ] }

jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run bootstrap
      - run: npm run build
      - run: npx playwright install --with-deps
      - run: npm run test:ci
YAML

# -------- FRONTEND /facturacion (SPA NEON) --------
mkdir -p frontend/facturacion/src/{ui,views,logic}
cat > frontend/facturacion/package.json <<'JSON'
{
  "name": "mu-facturacion",
  "private": true,
  "type": "module",
  "dependencies": {
    "chart.js": "^4.4.6",
    "react": "^18.3.1",
    "react-chartjs-2": "^5.2.0",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.0"
  }
}
JSON

cat > frontend/facturacion/jsconfig.json <<'JSON'
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@ui/*": ["ui/*"],
      "@views/*": ["views/*"],
      "@logic/*": ["logic/*"]
    },
    "jsx": "react-jsx",
    "module": "esnext",
    "target": "es2020"
  },
  "include": ["src/**/*"]
}
JSON

cat > frontend/facturacion/vite.config.js <<'JS'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  root: 'frontend/facturacion',
  base: '/',                 // assets servidos desde /
  build: {
    outDir: 'build',
    emptyOutDir: true,
    rollupOptions: { input: 'frontend/facturacion/index.html' }
  },
  server: { port: 5173 }
});
JS

cat > frontend/facturacion/index.html <<'HTML'
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MU · Facturación</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
HTML

cat > frontend/facturacion/src/main.jsx <<'JS'
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import RoutesMU from './routes.jsx';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  // Basename explícito: todas las rutas cuelgan de /facturacion
  <BrowserRouter basename="/facturacion">
    <RoutesMU />
  </BrowserRouter>
);
JS

cat > frontend/facturacion/src/routes.jsx <<'JS'
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LayoutMU from '@ui/LayoutMU.jsx';
import LoginPage from '@views/LoginPage.jsx';
import SolicitudPage from '@views/SolicitudPage.jsx';
import ConsultaPage from '@views/ConsultaPage.jsx';
import DashboardPage from '@views/DashboardPage.jsx';
import TesterPage from '@views/TesterPage.jsx';

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('mu_session');
  return token ? children : <Navigate to="/login" replace />;
};

export default function RoutesMU() {
  return (
    <Routes>
      <Route element={<LayoutMU />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/solicitud" element={<RequireAuth><SolicitudPage /></RequireAuth>} />
        <Route path="/consulta" element={<RequireAuth><ConsultaPage /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/tester" element={<RequireAuth><TesterPage /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  );
}
JS

cat > frontend/facturacion/src/styles.css <<'CSS'
:root {
  --bg:#09090b; --card:#111827; --text:#f9fafb; --text-sec:#9ca3af;
  --maiz:#facc15; --dorado:#fbbf24; --verde:#064e3b; --neon:#a3e635;
}
html, body, #root { height: 100%; }
body {
  background:
    radial-gradient(circle at 30% 10%, rgba(250, 204, 21, 0.12), transparent 22%),
    radial-gradient(circle at 80% 20%, rgba(20, 83, 45, 0.18), transparent 30%),
    var(--bg);
  color: var(--text);
  font-family: "JetBrains Mono", ui-monospace, Menlo, Monaco, Consolas, monospace;
}
a { color: var(--maiz); text-decoration: none; }
button { font-family: "Archivo Black", system-ui, sans-serif; }
input, select { color: var(--text); background: var(--card); border: 1px solid #000; border-radius: 8px; padding: 8px 12px; }
CSS

cat > frontend/facturacion/src/ui/LayoutMU.jsx <<'JS'
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export default function LayoutMU() {
  const Item = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block rounded px-3 py-2 ${isActive ? 'bg-[#121212]' : 'hover:bg-[#121212]'}`
      }
    >
      {children}
    </NavLink>
  );
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="bg-[#0b0b0c] border-r border-black p-4">
        <div className="flex items-center gap-2 mb-6">
          <img src="/logo-mu.png" alt="MU" className="h-8" />
          <span className="text-xs text-[#a3e635]">NEON</span>
        </div>
        <nav className="text-sm grid gap-1">
          <Item to="/login">Login</Item>
          <Item to="/solicitud">Solicitud</Item>
          <Item to="/consulta">Consulta</Item>
          <Item to="/dashboard">Dashboard</Item>
          <Item to="/tester">Tester</Item>
        </nav>
      </aside>
      <main className="bg-[#09090b] p-6">
        <Outlet />
      </main>
    </div>
  );
}
JS

# ------- lógica mock (login / facturas / ocr) -------
cat > frontend/facturacion/src/logic/session.js <<'JS'
export function login(email, password) {
  if (!email || !password) return { ok: false, error: 'Credenciales requeridas' };
  const fakeToken = `mu.${btoa(email)}.${Date.now()}`;
  localStorage.setItem('mu_session', fakeToken);
  localStorage.setItem('mu_user', JSON.stringify({ email }));
  return { ok: true, token: fakeToken };
}
export function submitSolicitud(payload) {
  const list = JSON.parse(localStorage.getItem('mu_invoices') || '[]');
  const folio = `MU-${Date.now()}`;
  list.push({ ...payload, folio, fecha: new Date().toISOString(), monto: Number(payload?.monto || 0) });
  localStorage.setItem('mu_invoices', JSON.stringify(list));
  return { ok: true, folio };
}
export function consultarEstatus({ rfc, ticket }) {
  const list = JSON.parse(localStorage.getItem('mu_invoices') || '[]');
  const found = list.filter(x => (!rfc || x.rfc===rfc) && (!ticket || x.ticket===ticket));
  return { ok: true, results: found };
}
JS

cat > frontend/facturacion/src/logic/ocr.js <<'JS'
export async function ocrTicket(file) {
  if (!file) throw new Error('Archivo requerido');
  await new Promise(r => setTimeout(r, 300));
  return {
    ok: true,
    text: 'RFC: MUAX010101ABC\nTICKET: 123456\nMONTO: 248.50\nFECHA: 2025-10-02',
    parsed: { rfc: 'MUAX010101ABC', ticket: '123456', monto: 248.5, fecha: '2025-10-02' },
  };
}
JS

# ------- vistas -------
cat > frontend/facturacion/src/views/LoginPage.jsx <<'JS'
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '@logic/session.js';

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [err, setErr] = React.useState('');
  const onSubmit = (e) => {
    e.preventDefault();
    const { ok, error } = login(email, password);
    if (!ok) return setErr(error || 'Error');
    nav('/solicitud');
  };
  return (
    <div className="max-w-md">
      <h1 className="font-heading text-2xl mb-4">Acceso · Facturación</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-xs text-[#9ca3af]">Email</span>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-[#9ca3af]">Password</span>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </label>
        {err && <p className="text-red-400 text-xs">{err}</p>}
        <button className="mt-2 rounded-xl border-2 border-black bg-[#facc15] px-4 py-2 font-heading text-black shadow-[4px_6px_0_#000] hover:-translate-y-[2px]">
          Entrar
        </button>
      </form>
    </div>
  );
}
JS

cat > frontend/facturacion/src/views/SolicitudPage.jsx <<'JS'
import React from 'react';
import { submitSolicitud } from '@logic/session.js';
import { ocrTicket } from '@logic/ocr.js';

export default function SolicitudPage() {
  const [form, setForm] = React.useState({ rfc:'', ticket:'', monto:'', usoCFDI:'G03' });
  const [msg, setMsg] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const setVal = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const onSubmit = (e) => {
    e.preventDefault();
    const { ok, folio } = submitSolicitud({ ...form, monto: Number(form.monto) });
    if (ok) setMsg(`Solicitud registrada. Folio: ${folio}`);
  };

  const onOCR = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setLoading(true);
    try {
      const r = await ocrTicket(f);
      if (r?.parsed) {
        setForm(s => ({ ...s, ...r.parsed, monto: String(r.parsed.monto) }));
        setMsg('Datos capturados por OCR');
      }
    } catch {
      setMsg('OCR falló');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-2xl mb-4">Solicitud de Factura</h1>
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-xs text-[#9ca3af]">RFC</span>
            <input value={form.rfc} onChange={e=>setVal('rfc', e.target.value)} required />
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-[#9ca3af]">Ticket</span>
            <input value={form.ticket} onChange={e=>setVal('ticket', e.target.value)} required />
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-[#9ca3af]">Monto</span>
            <input type="number" step="0.01" value={form.monto} onChange={e=>setVal('monto', e.target.value)} required />
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-[#9ca3af]">Uso CFDI</span>
            <select value={form.usoCFDI} onChange={e=>setVal('usoCFDI', e.target.value)}>
              <option value="G01">G01</option>
              <option value="G03">G03</option>
            </select>
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <button type="button" onClick={()=>setForm(s=>({...s, usoCFDI:'G03'}))} className="rounded border-2 border-black bg-[#121212] px-3 py-2">Autofill CFDI G03</button>
          <label className="rounded border-2 border-black bg-[#121212] px-3 py-2 text-center cursor-pointer">
            {loading ? 'OCR...' : 'Subir ticket (OCR)'}
            <input type="file" accept="image/*" className="hidden" onChange={onOCR}/>
          </label>
        </div>

        <button className="rounded-xl border-2 border-black bg-[#facc15] px-4 py-2 font-heading text-black shadow-[4px_6px_0_#000] hover:-translate-y-[2px]">
          Registrar Solicitud
        </button>
      </form>
      {msg && <p className="mt-3 text-sm text-[#a3e635]">{msg}</p>}
    </div>
  );
}
JS

cat > frontend/facturacion/src/views/ConsultaPage.jsx <<'JS'
import React from 'react';
import { consultarEstatus } from '@logic/session.js';

export default function ConsultaPage() {
  const [rfc, setRfc] = React.useState('');
  const [ticket, setTicket] = React.useState('');
  const [results, setResults] = React.useState([]);

  const onSearch = () => {
    const { ok, results } = consultarEstatus({ rfc, ticket });
    if (ok) setResults(results);
  };

  return (
    <div>
      <h1 className="font-heading text-2xl mb-4">Consulta de Estatus</h1>
      <div className="grid grid-cols-3 gap-3 max-w-3xl">
        <input placeholder="RFC" value={rfc} onChange={e=>setRfc(e.target.value)} />
        <input placeholder="Ticket" value={ticket} onChange={e=>setTicket(e.target.value)} />
        <button onClick={onSearch} className="rounded-xl border-2 border-black bg-[#facc15] px-4 py-2 font-heading text-black shadow-[4px_6px_0_#000] hover:-translate-y-[2px]">
          Buscar
        </button>
      </div>
      <div className="mt-6">
        {results.length === 0 ? (
          <p className="text-sm text-[#9ca3af]">Sin resultados</p>
        ) : (
          <div className="overflow-auto rounded border border-black">
            <table className="min-w-[600px] text-sm">
              <thead className="bg-[#121212]">
                <tr>
                  <th className="p-2 text-left">Folio</th>
                  <th className="p-2 text-left">RFC</th>
                  <th className="p-2 text-left">Ticket</th>
                  <th className="p-2 text-left">Monto</th>
                  <th className="p-2 text-left">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r=>(
                  <tr key={r.folio} className="odd:bg-[#0f0f0f] even:bg-[#111111]">
                    <td className="p-2">{r.folio}</td>
                    <td className="p-2">{r.rfc}</td>
                    <td className="p-2">{r.ticket}</td>
                    <td className="p-2">${Number(r.monto).toFixed(2)}</td>
                    <td className="p-2">{new Date(r.fecha).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
JS

cat > frontend/facturacion/src/views/DashboardPage.jsx <<'JS'
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function DashboardPage() {
  const data = React.useMemo(() => {
    const inv = JSON.parse(localStorage.getItem('mu_invoices') || '[]');
    const byDay = inv.reduce((acc, i) => {
      const d = (i.fecha || '').slice(0,10);
      acc[d] = (acc[d] || 0) + Number(i.monto || 0);
      return acc;
    }, {});
    const labels = Object.keys(byDay).sort();
    return { labels, datasets: [{ label: 'Monto diario', data: labels.map(l => byDay[l]) }] };
  }, []);
  const kpi = React.useMemo(() => {
    const inv = JSON.parse(localStorage.getItem('mu_invoices') || '[]');
    const total = inv.reduce((s, i) => s + Number(i.monto||0), 0);
    return { total, count: inv.length, avg: inv.length ? total/inv.length : 0 };
  }, []);
  return (
    <div className="grid gap-6">
      <h1 className="font-heading text-2xl">Dashboard</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <KPI title="Total facturado" value={`$ ${kpi.total.toFixed(2)}`} />
        <KPI title="Solicitudes" value={kpi.count} />
        <KPI title="Ticket promedio" value={`$ ${kpi.avg.toFixed(2)}`} />
      </div>
      <div className="rounded border border-black bg-[#111827] p-4">
        <Line data={data} options={{ plugins:{ legend:{ display:false }}, scales:{ x:{ grid:{ color:'#222'} }, y:{ grid:{ color:'#222'} } } }} />
      </div>
    </div>
  );
}
function KPI({ title, value }) {
  return (
    <div className="rounded-xl border-2 border-black bg-[#121212] p-4 shadow-[4px_6px_0_#000]">
      <p className="text-xs text-[#9ca3af]">{title}</p>
      <p className="mt-1 text-2xl font-heading text-[#facc15]">{value}</p>
    </div>
  );
}
JS

cat > frontend/facturacion/src/views/TesterPage.jsx <<'JS'
import React from 'react';
export default function TesterPage() {
  const [log, setLog] = React.useState([]);
  const wipeDB = () => {
    localStorage.removeItem('mu_invoices');
    setLog(l => [`${new Date().toISOString()} · wipeDB OK`, ...l]);
  };
  const addSample = () => {
    const list = JSON.parse(localStorage.getItem('mu_invoices') || '[]');
    const row = { rfc:'MUAX010101ABC', ticket:String(Math.floor(Math.random()*1e6)), monto: (50+Math.random()*300).toFixed(2), fecha: new Date().toISOString() };
    list.push(row);
    localStorage.setItem('mu_invoices', JSON.stringify(list));
    setLog(l => [`${new Date().toISOString()} · sample added`, ...l]);
  };
  return (
    <div className="grid gap-4">
      <h1 className="font-heading text-2xl">Tester</h1>
      <div className="flex gap-3">
        <button onClick={wipeDB} className="rounded-xl border-2 border-black bg-[#f97316] px-4 py-2 font-heading text-black shadow-[4px_6px_0_#000] hover:-translate-y-[2px]">Wipe DB</button>
        <button onClick={addSample} className="rounded-xl border-2 border-black bg-[#facc15] px-4 py-2 font-heading text-black shadow-[4px_6px_0_#000] hover:-translate-y-[2px]">Add Sample</button>
      </div>
      <div className="rounded border border-black bg-[#0f0f0f] p-3">
        <pre className="text-xs whitespace-pre-wrap">{log.join('\n')}</pre>
      </div>
    </div>
  );
}
JS

# -------- FRONTEND /mu-mount (widget/landing pack con fallback + flag) --------
mkdir -p frontend/mu-mount/src/components
cat > frontend/mu-mount/package.json <<'JSON'
{
  "name": "mu-mount",
  "private": true,
  "type": "module",
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.0"
  }
}
JSON

cat > frontend/mu-mount/.env.example <<'ENV'
VITE_MU_MOUNT_AUTORUN=true
ENV

cat > frontend/mu-mount/vite.config.js <<'JS'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  root: 'frontend/mu-mount',
  define: {
    'import.meta.env.VITE_MU_MOUNT_AUTORUN': JSON.stringify(process.env.VITE_MU_MOUNT_AUTORUN || 'true')
  },
  build: {
    lib: { entry: 'src/mount.js', name: 'MUMount', formats: ['es'], fileName: () => 'mu-mount.js' },
    outDir: 'dist',
    emptyOutDir: true
  },
  server: { port: 5174 }
}));
JS

# --- componentes landing MU (escopados con data-mu-root + CSS fallback) ---
cat > frontend/mu-mount/src/components/NavBarMU.jsx <<'JS'
import React from 'react';
export default function NavBarMU() {
  const [isDark, setDark] = React.useState(
    typeof window !== 'undefined'
      ? (document.documentElement.classList.contains('dark') ||
         (!localStorage.getItem('maiz-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches))
      : true
  );
  const toggle = () => {
    const root = document.documentElement;
    const next = !root.classList.contains('dark');
    root.classList.toggle('dark', next);
    localStorage.setItem('maiz-theme', next ? 'dark' : 'light');
    setDark(next);
  };
  return (
    <header>
      <div className="mu-container mu-row">
        <a href="#top" style={{ display:'flex', alignItems:'center', gap:12 }}>
          <img src="/logo-mu.png" alt="Logo Maíz Urbano" style={{ height:48 }} />
          <div className="sm:block" style={{ display:'none' }}>
            <p style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:'var(--maiz)' }}>
              Maíz Urbano
            </p>
            <p style={{ fontFamily:'Archivo Black,system-ui,sans-serif', fontSize:18, lineHeight:1 }}>Sistema Operativo Callejero</p>
          </div>
        </a>
        <nav className="sm:flex" style={{ display:'none', gap:24, fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.2em' }}>
          <a href="#sucursales">Sucursales</a><a href="#menu-mu">Menú MU</a><a href="#valores">Valores</a><a href="#empleo">Empleo</a><a href="#franquicias">Franquicias</a>
        </nav>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={toggle} className="mu-cta" style={{ background:'transparent', color:'var(--maiz)' }}>
            {isDark ? 'Light' : 'Dark'}
          </button>
          <a href="https://wa.me/525511223344?text=Hola%20quiero%20pedir" className="mu-cta">Ordena aquí</a>
        </div>
      </div>
    </header>
  );
}
JS

cat > frontend/mu-mount/src/components/HeroMU.jsx <<'JS'
import React from 'react';
export default function HeroMU() {
  return (
    <section className="mu-hero">
      <div className="mu-orb" aria-hidden="true"></div>
      <div className="mu-container" style={{ display:'grid', gap:32, gridTemplateColumns:'1.1fr 0.9fr', alignItems:'center' }}>
        <div style={{ display:'grid', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <img src="/logo-mu.png" alt="Logo Maíz Urbano" style={{ height:56 }} />
            <span className="mu-badge">STREET FOOD GOURMET · CDMX</span>
          </div>
          <h1 style={{ fontFamily:'Archivo Black,system-ui,sans-serif', fontWeight:900, fontSize:'48px', lineHeight:1.1 }}>
            MAÍZ URBANO<br/>STREET GOURMET // EDICIÓN 2025
          </h1>
          <p style={{ maxWidth:720, color:'var(--text-sec)' }}>
            Cocina brutalista con precisión técnica. Operación lista para escalar en asfalto o punto fijo.
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <a href="#menu-mu" className="mu-cta">Ver Menú</a>
            <a href="#recetas" className="mu-cta" style={{ background:'var(--dorado)' }}>Ver Recetas Técnicas</a>
          </div>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', font:'12px \"JetBrains Mono\", monospace', letterSpacing:'.25em', color:'var(--text-sec)' }}>
            <span className="mu-chip maiz">SOP + Capacitación</span>
            <span className="mu-chip" style={{ background:'color-mix(in oklab, var(--verde) 30%, transparent)', color:'var(--text)' }}>Origen responsable</span>
            <span className="mu-chip" style={{ background:'color-mix(in oklab, #0f0f0f 60%, transparent)', color:'var(--text)' }}>Listo para delivery</span>
          </div>
        </div>
        <div>
          <div className="mu-card" style={{ padding:16, background:'linear-gradient(135deg, #0b0b0c, #0f0f10 60%, color-mix(in oklab, var(--verde) 40%, transparent))', border:'1px solid color-mix(in oklab, var(--maiz) 25%, transparent)', position:'relative' }}>
            <img src="/mu-mascot.png" alt="Mascota Maíz Urbano" style={{ filter:'drop-shadow(0 0 24px var(--maiz))', margin:'0 auto' }} />
            <span style={{ position:'absolute', right:16, top:12, font:'12px \"JetBrains Mono\", monospace', color:'var(--neon)' }}>SYSTEM READY</span>
          </div>
        </div>
      </div>
    </section>
  );
}
JS

cat > frontend/mu-mount/src/components/MenuMU.jsx <<'JS'
import React from 'react';
function Card({ title, price, description, imgSrc, picor='bajo' }) {
  const borderClass = picor==='alto' ? 'mu-border-alto' : picor==='medio' ? 'mu-border-medio' : 'mu-border-bajo';
  return (
    <article className={`mu-card ${borderClass}`}>
      {imgSrc ? <img src={imgSrc} alt={title} style={{ height:208, width:'100%', objectFit:'cover' }} /> : null}
      <div className="mu-body">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h3 style={{ fontFamily:'Archivo Black,system-ui,sans-serif', fontSize:20 }}>{title}</h3>
          {price ? <span className="mu-chip maiz">{price}</span> : null}
        </div>
        {description ? <p style={{ color:'var(--text-sec)', fontSize:14, marginTop:8 }}>{description}</p> : null}
        <p style={{ font:'11px \"JetBrains Mono\", monospace', letterSpacing:'.25em', color:'var(--maiz)', marginTop:8 }}>MU Street Gourmet</p>
      </div>
    </article>
  );
}
export default function MenuMU() {
  const items = [
    { title:'Elote entero montado', description:'Elote criollo, montado al momento con toppings artesanales.', imgSrc:'/assets/elote-montado.jpg', picor:'bajo',  price:'$75' },
    { title:'Esquite salteado Davadi', description:'Grano salteado con sofrito profesional, servido con toppings.', imgSrc:'/assets/esquites.jpg',      picor:'medio', price:'$68' },
    { title:'Panqué de elote con pinole', description:'Panqué con maíz amarillo, azul y piloncillo.', imgSrc:'/assets/panque-elote.jpg', picor:'bajo', price:'$85' },
    { title:'Arsenal de salsas', description:'Manzano / Habanero / Macha / Aderezos', imgSrc:'', picor:'alto' },
  ];
  return (
    <section id="menu-mu" style={{ padding:'64px 0', background:'var(--bg)' }}>
      <div className="mu-container">
        <div style={{ marginBottom:24 }}>
          <p style={{ font:'12px \"JetBrains Mono\", monospace', textTransform:'uppercase', letterSpacing:'.3em', color:'var(--neon)' }}>Menú MU</p>
          <h2 style={{ fontFamily:'Archivo Black,system-ui,sans-serif', fontSize:32 }}>Street Gourmet // 2025</h2>
          <p style={{ marginTop:8, maxWidth:720, color:'var(--text-sec)' }}>Bordes de color = nivel de picor. Hecho al momento, empaque seguro.</p>
        </div>
        <div className="mu-grid cols-3">
          {items.map((p) => (<Card key={p.title} {...p} />))}
        </div>
      </div>
    </section>
  );
}
JS

cat > frontend/mu-mount/src/components/FooterMU.jsx <<'JS'
import React from 'react';
export default function FooterMU() {
  return (
    <footer>
      <div className="mu-container" style={{ display:'grid', gap:24, gridTemplateColumns:'2fr 1fr 1fr' }}>
        <div>
          <p style={{ font:'12px \"JetBrains Mono\", monospace', textTransform:'uppercase', letterSpacing:'.3em', color:'var(--maiz)' }}>Maíz Urbano</p>
          <p style={{ fontFamily:'Archivo Black,system-ui,sans-serif', fontSize:20 }}>Tradición callejera, operación moderna.</p>
          <div style={{ fontSize:14, marginTop:8 }}>
            <p style={{ fontFamily:'JetBrains Mono,monospace' }}>MAÍZ URBANO SYSTEM V.2025</p>
            <p style={{ fontFamily:'JetBrains Mono,monospace' }}>DESIGNED FOR STREET CULINARY OPERATIONS</p>
          </div>
        </div>
        <div>
          <h3 style={{ fontFamily:'Archivo Black,system-ui,sans-serif', fontSize:14, textTransform:'uppercase', letterSpacing:'.2em' }}>Dirección</h3>
          <ul style={{ marginTop:12, fontSize:14 }}>
            <li>Andes 91, Los Alpes, Álvaro Obregón, CDMX</li>
            <li>Tel: 7772168377</li>
          </ul>
        </div>
        <div>
          <h3 style={{ fontFamily:'Archivo Black,system-ui,sans-serif', fontSize:14, textTransform:'uppercase', letterSpacing:'.2em' }}>Acceso</h3>
          <ul style={{ marginTop:12, fontSize:14 }}>
            <li><a href="/facturacion">Portal de Facturación</a></li>
          </ul>
        </div>
      </div>
      <div style={{ borderTop:'1px solid color-mix(in oklab, var(--maiz) 30%, transparent)', marginTop:24, paddingTop:12 }}>
        <div className="mu-container" style={{ display:'flex', justifyContent:'space-between', gap:12, fontSize:14, color:'var(--text-sec)' }}>
          <span>© {new Date().getFullYear()} Maíz Urbano. Todos los derechos reservados.</span>
          <span style={{ font:'12px \"JetBrains Mono\", monospace', textTransform:'uppercase', letterSpacing:'.25em', color:'var(--maiz)' }}>
            Streetwear Gourmet · Neo-Brutalismo
          </span>
        </div>
      </div>
    </footer>
  );
}
JS

cat > frontend/mu-mount/src/AppMU.jsx <<'JS'
import React from 'react';
import NavBarMU from './components/NavBarMU.jsx';
import HeroMU from './components/HeroMU.jsx';
import MenuMU from './components/MenuMU.jsx';
import FooterMU from './components/FooterMU.jsx';

export default function AppMU() {
  return (
    <div data-mu-root>
      <NavBarMU />
      <HeroMU />
      <MenuMU />
      <FooterMU />
    </div>
  );
}
JS

cat > frontend/mu-mount/src/mount.js <<'JS'
import React from 'react';
import { createRoot } from 'react-dom/client';
import AppMU from './AppMU.jsx';

function injectFallbackStyles() {
  if (document.getElementById('mu-fallback-css')) return;
  const css = `
  [data-mu-root]{--bg:#09090b;--card1:#111827;--card2:#121212;--text:#f9fafb;--text-sec:#9ca3af;--maiz:#facc15;--dorado:#fbbf24;--verde:#064e3b;--neon:#a3e635;--black:#000;font-family:"Inter",system-ui,sans-serif;color:var(--text);background:var(--bg)}
  [data-mu-root] a{color:var(--maiz);text-decoration:none}
  [data-mu-root] img{display:block;max-width:100%}
  [data-mu-root] header{position:sticky;top:0;z-index:50;border-bottom:1px solid color-mix(in oklab,var(--maiz) 30%,transparent);backdrop-filter:saturate(1.2) blur(6px);background:color-mix(in oklab,#fff 20%,transparent)}
  @media (prefers-color-scheme: dark){[data-mu-root] header{background:color-mix(in oklab,var(--bg) 80%,transparent)}}
  [data-mu-root] .mu-container{max-width:1200px;margin:0 auto;padding:0 24px}
  [data-mu-root] .mu-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px 0}
  [data-mu-root] .mu-badge{border:1px solid color-mix(in oklab,var(--maiz) 60%,transparent);background:color-mix(in oklab,var(--bg) 70%,transparent);color:var(--maiz);padding:6px 10px;font:11px/1.1 "JetBrains Mono",monospace;text-transform:uppercase;letter-spacing:.3em;border-radius:999px}
  [data-mu-root] .mu-cta{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:2px solid var(--black);background:var(--maiz);color:#000;padding:12px 16px;border-radius:12px;font-family:"Archivo Black";text-transform:uppercase;letter-spacing:.2em;box-shadow:4px 6px 0 var(--black);transition:transform .12s ease}
  [data-mu-root] .mu-cta:hover{transform:translateY(-2px)}
  [data-mu-root] .mu-card{background:var(--card1);color:var(--text);border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,.35);border:2px solid var(--black);overflow:hidden}
  [data-mu-root] .mu-card .mu-body{padding:20px}
  [data-mu-root] .mu-chip{display:inline-block;padding:6px 10px;border-radius:999px;font:11px "JetBrains Mono",monospace;letter-spacing:.2em}
  [data-mu-root] .mu-chip.maiz{background:color-mix(in oklab,var(--maiz) 20%,transparent);color:var(--verde)}
  [data-mu-root] .mu-grid{display:grid;gap:24px}
  @media (min-width:768px){[data-mu-root] .mu-grid.cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}}
  [data-mu-root] .mu-hero{position:relative;overflow:hidden;padding:64px 0;background:var(--bg)}
  [data-mu-root] .mu-hero .mu-orb{position:absolute;width:360px;height:360px;left:-64px;top:-64px;filter:blur(60px);border-radius:9999px;background:color-mix(in oklab,var(--maiz) 20%,transparent);mix-blend:screen}
  [data-mu-root] .mu-kpi{background:var(--card2);border:2px solid var(--black);border-radius:12px;padding:16px;box-shadow:4px 6px 0 var(--black)}
  [data-mu-root] footer{background:var(--bg);color:var(--text);padding:40px 0;border-top:1px solid color-mix(in oklab,var(--maiz) 30%,transparent)}
  [data-mu-root] .mu-border-bajo{border-color:var(--verde)}
  [data-mu-root] .mu-border-medio{border-color:#f97316}
  [data-mu-root] .mu-border-alto{border-color:#b91c1c}
  `;
  const style = document.createElement('style');
  style.id = 'mu-fallback-css';
  style.textContent = css;
  document.head.appendChild(style);
}

export function mountMU(selector = '#mu-root', { injectCSS = true } = {}) {
  if (injectCSS) injectFallbackStyles();
  const el = document.querySelector(selector);
  if (!el) return false;
  const root = createRoot(el);
  root.render(<AppMU />);
  return true;
}

const envFlag = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_MU_MOUNT_AUTORUN) ?? 'true';
const winFlag = (typeof window !== 'undefined' && window.MU_MOUNT_AUTORUN);
const autorun = String(winFlag ?? envFlag).toLowerCase() !== 'false';

if (typeof window !== 'undefined' && autorun) {
  mountMU();
}
JS

# -------- README de integración rápida --------
cat > README-MU-SETUP.md <<'MD'
# MU Setup v2 (Frontend aditivo, sin tocar backend)

## 1) Instalar y construir
```bash
npm ci
npm run bootstrap
npm run build
```

## 2) Servir SPA /facturacion en Express (opcional, no destructivo)
En tu server Express:

```js
// const express = require('express'); const path = require('path'); const app = express();
app.use('/facturacion', require('express').static(require('path').join(__dirname, 'frontend/facturacion/build')));
app.get('/facturacion/*', (_, res) =>
  res.sendFile(require('path').join(__dirname, 'frontend/facturacion/build/index.html'))
);
```

## 3) Montar MU Landing Pack en la landing actual (opcional)
Añade en tu HTML SIN reemplazar nada:

```html
<div id="mu-root"></div>
<script>/* override opcional */ window.MU_MOUNT_AUTORUN = true;</script>
<script type="module" src="/frontend/mu-mount/dist/mu-mount.js"></script>
```

Si ya usas Tailwind y no quieres el CSS fallback:

```html
<script type="module">
  import { mountMU } from '/frontend/mu-mount/dist/mu-mount.js';
  mountMU('#mu-root', { injectCSS:false });
</script>
```

## 4) Flags de auto-montaje
- Build: `frontend/mu-mount/.env` → `VITE_MU_MOUNT_AUTORUN=true|false`
- Runtime: `window.MU_MOUNT_AUTORUN = false` antes del `<script>`.

## 5) Probar local
```bash
npm run preview:facturacion   # http://localhost:5173/facturacion/login
npm run test:e2e              # smoke + OCR + KPIs
```

## 6) Assets
Coloca:
- `/public/logo-mu.png`
- `/public/mu-mascot.png`
MD

echo "✅ v2 lista. Lee README-MU-SETUP.md para el flujo completo."
