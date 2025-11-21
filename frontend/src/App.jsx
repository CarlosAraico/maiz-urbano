import { useEffect, useMemo, useState } from 'react';
import Hero from './components/Hero.jsx';
import NavBar from './components/NavBar.jsx';
import RecipeCard from './components/RecipeCard.jsx';
import CookOverlay from './components/CookOverlay.jsx';
import SubRecipesList from './components/SubRecipesList.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import {
  fetchRecipes,
  fetchSubrecipes,
  fetchMaterials,
  fetchProducts,
  fetchCosts,
  saveRecipe,
  saveSubrecipe,
  saveMaterial,
  saveProduct,
  saveCost
} from './api/client.js';

export default function App() {
  const [view, setView] = useState('home');
  const [recipes, setRecipes] = useState([]);
  const [subs, setSubs] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [products, setProducts] = useState([]);
  const [costs, setCosts] = useState([]);
  const [scale, setScale] = useState(50);
  const [cookMode, setCookMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    refreshAll();
  }, []);

  const refreshAll = () => {
    setLoading(true);
    Promise.all([fetchRecipes(), fetchSubrecipes(), fetchMaterials(), fetchProducts(), fetchCosts()])
      .then(([r, s, m, p, c]) => {
        setRecipes(r);
        setSubs(s);
        setMaterials(m);
        setProducts(p);
        setCosts(c);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (view !== 'home') setScale(50);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const active = useMemo(() => recipes.find((r) => r.id === view), [recipes, view]);

  return (
    <div className="font-sans bg-bg min-h-screen text-text selection:bg-accent-lime selection:text-black">
      {view === 'home' && <Hero onPrimary={() => setView('elote')} onSecondary={() => setView('esquites')} />}

      {loading && (
        <div className="flex items-center justify-center h-screen text-zinc-400 font-mono">Cargando datos...</div>
      )}

      {error && (
        <div className="flex items-center justify-center h-screen text-red-400 font-mono">Error: {error}</div>
      )}

      {!loading && !error && active && (
        <RecipeCard
          recipe={active}
          scale={scale}
          onScale={setScale}
          onStart={() => setCookMode(true)}
        />
      )}

      {!loading && !error && view === 'subrecipes' && <SubRecipesList subs={subs} />}

      {!loading && !error && view === 'admin' && (
        <AdminDashboard
          recipes={recipes}
          subs={subs}
          materials={materials}
          products={products}
          costs={costs}
          onSaveRecipe={saveRecipe}
          onSaveSubrecipe={saveSubrecipe}
          onSaveMaterial={saveMaterial}
          onSaveProduct={saveProduct}
          onSaveCost={saveCost}
          refreshAll={refreshAll}
        />
      )}

      {!cookMode && <NavBar view={view} setView={setView} />}

      {cookMode && active && (
        <CookOverlay
          recipe={active}
          onClose={() => setCookMode(false)}
        />
      )}

      <footer className="bg-black text-zinc-500 py-12 px-6 text-center font-mono text-xs border-t border-border pb-24 no-print">
        <p>MAÍZ URBANO SYSTEM V.1.0</p>
        <p className="mt-2">Diseñado para operaciones de calle</p>
      </footer>
    </div>
  );
}
