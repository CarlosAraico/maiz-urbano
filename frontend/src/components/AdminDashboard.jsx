import { useEffect, useMemo, useState } from 'react';
import { setAuthToken } from '../api/client.js';

const tabs = [
  { id: 'recipes', label: 'Recetas' },
  { id: 'materials', label: 'Materias primas' },
  { id: 'products', label: 'Productos' },
  { id: 'costs', label: 'Costos' }
];

export default function AdminDashboard({
  recipes,
  subs,
  materials,
  products,
  costs,
  onSaveRecipe,
  onSaveSubrecipe,
  onSaveMaterial,
  onSaveProduct,
  onSaveCost,
  refreshAll
}) {
  const [tab, setTab] = useState('recipes');
  const [token, setToken] = useState(() => localStorage.getItem('maiz-token') || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [recipeForm, setRecipeForm] = useState({
    id: '',
    title: '',
    tag: '',
    subtitle: '',
    description: '',
    cover_image: '',
    base_servings: 50,
    prep_time: '',
    cook_time: '',
    temp: '',
    difficulty: '',
    color: 'yellow',
    ingredients: '[]',
    steps: '[]',
    tips: '[]'
  });

  const [materialForm, setMaterialForm] = useState({ id: '', name: '', unit: '', unit_cost: '', supplier: '' });
  const [productForm, setProductForm] = useState({ id: '', name: '', recipe_id: '', price: '', notes: '' });
  const [costForm, setCostForm] = useState({ id: '', recipe_id: '', product_id: '', batch_size: '', labor_cost: '', packaging_cost: '', overhead: '', notes: '' });

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      localStorage.setItem('maiz-token', token);
    }
  }, [token]);

  const onSelectRecipe = (id) => {
    const found = recipes.find((r) => r.id === id);
    if (!found) return;
    setRecipeForm({
      ...found,
      ingredients: JSON.stringify(found.ingredients, null, 2),
      steps: JSON.stringify(found.steps, null, 2),
      tips: JSON.stringify(found.tips, null, 2)
    });
  };

  const handleRecipeSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const payload = {
        ...recipeForm,
        base_servings: Number(recipeForm.base_servings),
        prep_time: Number(recipeForm.prep_time) || null,
        cook_time: Number(recipeForm.cook_time) || null,
        ingredients: JSON.parse(recipeForm.ingredients || '[]'),
        steps: JSON.parse(recipeForm.steps || '[]'),
        tips: JSON.parse(recipeForm.tips || '[]')
      };
      await onSaveRecipe(payload);
      setMessage('Receta guardada');
      refreshAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubrecipeSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const payload = {
        id: e.target.id.value || Date.now().toString(),
        category: e.target.category.value,
        title: e.target.title.value,
        yield: e.target.yield.value,
        color: e.target.color.value,
        ingredients: JSON.parse(e.target.ingredients.value || '[]'),
        process: e.target.process.value
      };
      await onSaveSubrecipe(payload);
      setMessage('Subreceta guardada');
      refreshAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMaterialSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const payload = { ...materialForm, unit_cost: Number(materialForm.unit_cost) };
      await onSaveMaterial(payload);
      setMessage('Materia prima guardada');
      refreshAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const payload = { ...productForm, price: productForm.price ? Number(productForm.price) : null };
      await onSaveProduct(payload);
      setMessage('Producto guardado');
      refreshAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCostSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const payload = {
        ...costForm,
        id: costForm.id ? Number(costForm.id) : undefined,
        batch_size: costForm.batch_size ? Number(costForm.batch_size) : null,
        labor_cost: costForm.labor_cost ? Number(costForm.labor_cost) : null,
        packaging_cost: costForm.packaging_cost ? Number(costForm.packaging_cost) : null,
        overhead: costForm.overhead ? Number(costForm.overhead) : null
      };
      await onSaveCost(payload);
      setMessage('Costo guardado');
      refreshAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const coverPreview = useMemo(() => recipeForm.cover_image, [recipeForm.cover_image]);

  return (
    <section className="min-h-screen bg-bg text-text pt-20 pb-28 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-mono text-zinc-500">Modo Admin</p>
            <h1 className="text-3xl font-black uppercase">Panel de edición</h1>
          </div>
          <input
            type="password"
            placeholder="Bearer token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="bg-card border border-border rounded px-3 py-2 text-sm w-56"
            aria-label="Token de autenticación"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-2 rounded-full text-sm font-bold uppercase border border-border ${
                tab === t.id ? 'bg-accent-lime text-black' : 'bg-card text-zinc-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {message && <div className="text-green-400 font-mono text-sm">{message}</div>}
        {error && <div className="text-red-400 font-mono text-sm">{error}</div>}

        {tab === 'recipes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black">Receta</h2>
                <select
                  className="bg-card border border-border rounded px-2 py-1 text-sm"
                  onChange={(e) => onSelectRecipe(e.target.value)}
                  defaultValue=""
                  aria-label="Seleccionar receta"
                >
                  <option value="" disabled>Selecciona para cargar</option>
                  {recipes.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
                </select>
              </div>
              <form onSubmit={handleRecipeSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input className="input" placeholder="id" value={recipeForm.id} onChange={(e) => setRecipeForm({ ...recipeForm, id: e.target.value })} required />
                  <input className="input" placeholder="title" value={recipeForm.title} onChange={(e) => setRecipeForm({ ...recipeForm, title: e.target.value })} required />
                  <input className="input" placeholder="tag" value={recipeForm.tag} onChange={(e) => setRecipeForm({ ...recipeForm, tag: e.target.value })} />
                  <input className="input" placeholder="subtitle" value={recipeForm.subtitle} onChange={(e) => setRecipeForm({ ...recipeForm, subtitle: e.target.value })} />
                  <input className="input" placeholder="cover_image (URL)" value={recipeForm.cover_image} onChange={(e) => setRecipeForm({ ...recipeForm, cover_image: e.target.value })} />
                  <input className="input" placeholder="color (yellow/lime)" value={recipeForm.color} onChange={(e) => setRecipeForm({ ...recipeForm, color: e.target.value })} />
                  <input className="input" type="number" placeholder="base_servings" value={recipeForm.base_servings} onChange={(e) => setRecipeForm({ ...recipeForm, base_servings: e.target.value })} />
                  <input className="input" type="number" placeholder="prep_time" value={recipeForm.prep_time} onChange={(e) => setRecipeForm({ ...recipeForm, prep_time: e.target.value })} />
                  <input className="input" type="number" placeholder="cook_time" value={recipeForm.cook_time} onChange={(e) => setRecipeForm({ ...recipeForm, cook_time: e.target.value })} />
                  <input className="input" placeholder="temp" value={recipeForm.temp} onChange={(e) => setRecipeForm({ ...recipeForm, temp: e.target.value })} />
                  <input className="input" placeholder="difficulty" value={recipeForm.difficulty} onChange={(e) => setRecipeForm({ ...recipeForm, difficulty: e.target.value })} />
                  <textarea className="input col-span-2" placeholder="description" value={recipeForm.description} onChange={(e) => setRecipeForm({ ...recipeForm, description: e.target.value })} />
                </div>
                <label className="block text-xs uppercase text-zinc-400">Ingredientes (JSON)</label>
                <textarea className="input h-28" value={recipeForm.ingredients} onChange={(e) => setRecipeForm({ ...recipeForm, ingredients: e.target.value })} />
                <label className="block text-xs uppercase text-zinc-400">Pasos (JSON)</label>
                <textarea className="input h-28" value={recipeForm.steps} onChange={(e) => setRecipeForm({ ...recipeForm, steps: e.target.value })} />
                <label className="block text-xs uppercase text-zinc-400">Tips (JSON)</label>
                <textarea className="input h-20" value={recipeForm.tips} onChange={(e) => setRecipeForm({ ...recipeForm, tips: e.target.value })} />
                <button type="submit" className="w-full bg-accent-lime text-black font-black py-2 rounded">Guardar receta</button>
              </form>
            </div>
            <div className="card space-y-3">
              <h3 className="font-black">Preview portada</h3>
              {coverPreview
                ? <img src={coverPreview} alt="Portada" className="w-full h-64 object-cover rounded border border-border" />
                : <div className="h-64 border border-dashed border-border rounded flex items-center justify-center text-zinc-500">Sin imagen</div>}
              <p className="text-xs text-zinc-400">Usa la URL de portada para que la vista pública cargue tu imagen custom.</p>
              <div className="border-t border-border pt-4">
                <h4 className="font-black mb-2">Subrecetas / Hacks (JSON rápido)</h4>
                <form onSubmit={handleSubrecipeSubmit} className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input name="id" className="input" placeholder="id (opcional)" />
                    <input name="title" className="input" placeholder="título" required />
                    <input name="category" className="input" placeholder="categoría" required />
                    <input name="yield" className="input" placeholder="rendimiento" />
                    <input name="color" className="input" placeholder="color" />
                  </div>
                  <textarea name="ingredients" className="input h-20" placeholder='[{"name":"item","amount":"10g"}]' defaultValue="[]" />
                  <textarea name="process" className="input h-16" placeholder="Proceso" required />
                  <button type="submit" className="w-full bg-accent-yellow text-black font-black py-2 rounded">Guardar subreceta</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {tab === 'materials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card space-y-3">
              <h2 className="text-xl font-black">Materia prima</h2>
              <form onSubmit={handleMaterialSubmit} className="space-y-2">
                <input className="input" placeholder="id" value={materialForm.id} onChange={(e) => setMaterialForm({ ...materialForm, id: e.target.value })} required />
                <input className="input" placeholder="name" value={materialForm.name} onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })} required />
                <input className="input" placeholder="unit (g, ml, pz)" value={materialForm.unit} onChange={(e) => setMaterialForm({ ...materialForm, unit: e.target.value })} required />
                <input className="input" type="number" step="0.001" placeholder="unit_cost" value={materialForm.unit_cost} onChange={(e) => setMaterialForm({ ...materialForm, unit_cost: e.target.value })} required />
                <input className="input" placeholder="supplier" value={materialForm.supplier} onChange={(e) => setMaterialForm({ ...materialForm, supplier: e.target.value })} />
                <button type="submit" className="w-full bg-accent-lime text-black font-black py-2 rounded">Guardar</button>
              </form>
            </div>
            <div className="card">
              <h3 className="font-black mb-2">Listado</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {materials.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMaterialForm({ ...m })}
                    className="w-full text-left px-3 py-2 rounded border border-border hover:border-accent-lime"
                  >
                    <div className="flex justify-between">
                      <span className="font-bold">{m.name}</span>
                      <span className="text-sm text-zinc-400">${m.unit_cost}/{m.unit}</span>
                    </div>
                    <p className="text-xs text-zinc-500">{m.supplier}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card space-y-3">
              <h2 className="text-xl font-black">Producto</h2>
              <form onSubmit={handleProductSubmit} className="space-y-2">
                <input className="input" placeholder="id" value={productForm.id} onChange={(e) => setProductForm({ ...productForm, id: e.target.value })} required />
                <input className="input" placeholder="name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
                <select className="input" value={productForm.recipe_id} onChange={(e) => setProductForm({ ...productForm, recipe_id: e.target.value })}>
                  <option value="">Receta vinculada (opcional)</option>
                  {recipes.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
                </select>
                <input className="input" type="number" step="0.01" placeholder="price" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
                <textarea className="input" placeholder="notes" value={productForm.notes} onChange={(e) => setProductForm({ ...productForm, notes: e.target.value })} />
                <button type="submit" className="w-full bg-accent-yellow text-black font-black py-2 rounded">Guardar producto</button>
              </form>
            </div>
            <div className="card">
              <h3 className="font-black mb-2">Listado</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {products.map((p) => (
                  <button key={p.id} onClick={() => setProductForm({ ...p })} className="w-full text-left px-3 py-2 rounded border border-border hover:border-accent-lime">
                    <div className="flex justify-between">
                      <span className="font-bold">{p.name}</span>
                      {p.price ? <span className="text-sm text-zinc-400">${p.price}</span> : null}
                    </div>
                    <p className="text-xs text-zinc-500">Receta: {p.recipe_id || '—'}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'costs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card space-y-3">
              <h2 className="text-xl font-black">Costo</h2>
              <form onSubmit={handleCostSubmit} className="space-y-2">
                <input className="input" placeholder="id (para actualizar)" value={costForm.id} onChange={(e) => setCostForm({ ...costForm, id: e.target.value })} />
                <select className="input" value={costForm.recipe_id} onChange={(e) => setCostForm({ ...costForm, recipe_id: e.target.value })}>
                  <option value="">Receta</option>
                  {recipes.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
                </select>
                <select className="input" value={costForm.product_id} onChange={(e) => setCostForm({ ...costForm, product_id: e.target.value })}>
                  <option value="">Producto</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <input className="input" type="number" placeholder="batch_size" value={costForm.batch_size} onChange={(e) => setCostForm({ ...costForm, batch_size: e.target.value })} />
                <input className="input" type="number" step="0.01" placeholder="labor_cost" value={costForm.labor_cost} onChange={(e) => setCostForm({ ...costForm, labor_cost: e.target.value })} />
                <input className="input" type="number" step="0.01" placeholder="packaging_cost" value={costForm.packaging_cost} onChange={(e) => setCostForm({ ...costForm, packaging_cost: e.target.value })} />
                <input className="input" type="number" step="0.01" placeholder="overhead" value={costForm.overhead} onChange={(e) => setCostForm({ ...costForm, overhead: e.target.value })} />
                <textarea className="input" placeholder="notes" value={costForm.notes} onChange={(e) => setCostForm({ ...costForm, notes: e.target.value })} />
                <button type="submit" className="w-full bg-accent-lime text-black font-black py-2 rounded">Guardar costo</button>
              </form>
            </div>
            <div className="card">
              <h3 className="font-black mb-2">Historial</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {costs.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCostForm({ ...c })}
                    className="w-full text-left px-3 py-2 rounded border border-border hover:border-accent-lime"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="font-bold">#{c.id} {c.recipe_id || '—'}</span>
                      <span className="text-zinc-400">Batch: {c.batch_size || '—'}</span>
                    </div>
                    <p className="text-xs text-zinc-500">Labor: {c.labor_cost || 0} | Empaque: {c.packaging_cost || 0} | Overhead: {c.overhead || 0}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
