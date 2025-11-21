import { Printer, Play, ShoppingBag, Zap } from 'lucide-react';
import { scaleAmount } from '../utils/scale.js';

const groups = ['base', 'sofrito', 'sazon', 'montaje'];

const colorMap = {
  yellow: 'from-yellow-700 to-yellow-900',
  lime: 'from-lime-700 to-lime-900',
  zinc: 'from-zinc-700 to-zinc-900'
};

export default function RecipeCard({ recipe, scale, onScale, onStart }) {
  const gradient = colorMap[recipe.color] || 'from-zinc-700 to-zinc-900';
  const baseServings = recipe.base_servings ?? recipe.baseServings ?? 1;
  const scaledQty = (ing) => `${scaleAmount(ing.quantity, baseServings, scale)}${ing.unit}`;
  const headerStyle = recipe.cover_image
    ? { backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.65), rgba(0,0,0,0.6)), url(${recipe.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined;

  return (
    <section className="min-h-screen bg-bg pb-32">
      <header
        className={`relative w-full h-[40vh] bg-gradient-to-br ${gradient} flex items-end p-6 md:p-12 overflow-hidden no-print`}
        style={headerStyle}
      >
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" aria-hidden />
        <div className="relative z-10 w-full max-w-5xl mx-auto space-y-3">
          <span className="inline-block px-3 py-1 font-mono text-xs font-bold bg-black text-white border border-white uppercase tracking-widest">
            {recipe.tag}
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-white drop-shadow-lg">
            {recipe.title}
          </h1>
          <p className="text-zinc-200 font-medium text-lg max-w-xl border-l-4 border-white pl-4">
            {recipe.subtitle}
          </p>
        </div>
      </header>

      <div className="hidden print:block p-6 border-b-4 border-black">
        <h1 className="text-4xl font-black uppercase">{recipe.title}</h1>
        <p className="text-lg font-mono mt-2">Sistema Maíz Urbano | Batch: {scale} porciones</p>
      </div>

      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-border no-print">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap gap-3 justify-between items-center">
          <div className="flex items-center gap-2" aria-label="Escalar porciones">
            <span className="text-sm text-zinc-400">Porciones</span>
            <div className="flex items-center bg-card border border-border rounded-full px-1 py-1">
              <button
                onClick={() => onScale(Math.max(5, scale - 5))}
                className="w-8 h-8 rounded-full bg-border text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-accent-lime"
                aria-label="Reducir porciones"
              >
                −
              </button>
              <span className="w-24 text-center font-mono font-bold text-accent-lime">{scale} PAX</span>
              <button
                onClick={() => onScale(scale + 5)}
                className="w-8 h-8 rounded-full bg-border text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-accent-lime"
                aria-label="Aumentar porciones"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 bg-card rounded-full text-zinc-400 hover:text-white hover:bg-border focus:outline-none focus:ring-2 focus:ring-accent-lime"
              aria-label="Imprimir receta"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onStart}
              className="px-4 py-2 bg-accent-lime text-black font-black uppercase text-sm rounded-full flex items-center gap-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-accent-lime transition"
            >
              <Play className="w-4 h-4 fill-current" /> Cocina en vivo
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-12 gap-10 print:py-6 print:px-0">
        <aside className="md:col-span-5 space-y-8 print:col-span-5">
          <div className="card -rotate-1 print:rotate-0 print:bg-white">
            <h3 className="font-black uppercase text-sm text-zinc-400 mb-4 tracking-widest border-b border-border pb-2 print:text-black print:border-black">
              Tech Specs
            </h3>
            <dl className="grid grid-cols-2 gap-4 text-sm font-mono">
              <div>
                <dt className="text-zinc-500 print:text-black">Tiempo</dt>
                <dd className="text-white font-bold print:text-black">{recipe.cook_time ?? recipe.cookTime} min</dd>
              </div>
              <div>
                <dt className="text-zinc-500 print:text-black">Temp</dt>
                <dd className="text-white font-bold print:text-black">{recipe.temp}</dd>
              </div>
              <div>
                <dt className="text-zinc-500 print:text-black">Dificultad</dt>
                <dd className="text-white font-bold print:text-black">{recipe.difficulty}</dd>
              </div>
              <div>
                <dt className="text-zinc-500 print:text-black">Merma</dt>
                <dd className="text-white font-bold print:text-black">15% Avg</dd>
              </div>
            </dl>
          </div>

          <div className="card print:bg-white">
            <h3 className="font-black uppercase text-lg text-white mb-4 flex items-center gap-2 print:text-black">
              <ShoppingBag className="w-5 h-5 text-accent-lime" /> Ingredientes
            </h3>
            <div className="space-y-6">
              {groups.map((type) => {
                const group = recipe.ingredients.filter((i) => i.type === type);
                if (!group.length) return null;
                return (
                  <div key={type} className="space-y-3">
                    <span className="pill">{type}</span>
                    <ul className="space-y-2 font-mono text-sm">
                      {group.map((ing, idx) => (
                        <li key={`${ing.name}-${idx}`} className="flex justify-between items-center border-b border-border pb-2 print:border-black">
                          <span className="text-zinc-300 print:text-black">{ing.name}</span>
                          <strong className="text-white print:text-black">{scaledQty(ing)}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="md:col-span-7 space-y-10 print:col-span-7">
          <p className="text-xl font-medium leading-relaxed text-zinc-300 print:text-black">
            {recipe.description}
          </p>

          <ol className="space-y-6">
            {recipe.steps.map((step, idx) => (
              <li key={`${step.title}-${idx}`} className="relative pl-8 border-l-2 border-border group print:border-black">
                <span className="absolute -left-[9px] top-0 w-4 h-4 bg-bg border-2 border-zinc-600 rounded-full group-hover:border-accent-lime group-hover:bg-accent-lime transition-all print:bg-black print:border-black" />
                <h4 className="text-lg font-black uppercase text-white mb-2 group-hover:text-accent-lime transition-colors print:text-black">
                  {idx + 1}. {step.title}
                </h4>
                <p className="text-zinc-400 font-mono text-sm leading-relaxed print:text-black">
                  {step.description ?? step.desc}
                </p>
              </li>
            ))}
          </ol>

          <div className="card border-pink-500/60">
            <h3 className="text-pink-400 font-black uppercase mb-3 flex items-center gap-2 print:text-black">
              <Zap className="w-5 h-5" /> Chef Hacks
            </h3>
            <ul className="list-disc list-inside text-zinc-300 text-sm space-y-2 font-mono print:text-black">
              {recipe.tips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>
        </main>
      </div>
    </section>
  );
}
