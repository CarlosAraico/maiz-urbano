export default function SubRecipesList({ subs = [] }) {
  return (
    <section className="min-h-screen bg-bg pt-20 pb-32 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 uppercase mb-2 print:text-black">
          El Arsenal
        </h2>
        <p className="text-zinc-400 font-mono mb-12 print:text-black">Salsas madre, emulsiones y toppings.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:block print:space-y-8">
          {subs.map((sub) => (
            <article
              key={sub.id}
              className="card overflow-hidden hover:border-white transition-all group print:bg-white print:border-black print:break-inside-avoid print:mb-4"
            >
              <header className="p-4 flex justify-between items-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-400">{sub.category}</span>
                  <h3 className="text-2xl font-black text-white group-hover:text-accent-yellow transition-colors print:text-black">{sub.title}</h3>
                </div>
                <span className="text-xs bg-border px-3 py-1 rounded font-mono text-zinc-300 print:border print:border-black print:bg-transparent print:text-black">{sub.yield}</span>
              </header>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-zinc-500 mb-2 print:text-black">Ingredientes</h4>
                  <div className="flex flex-wrap gap-2">
                    {sub.ingredients.map((ing, i) => (
                      <span
                        key={`${ing.name}-${i}`}
                        className="px-2 py-1 bg-border border border-border rounded text-xs text-zinc-200 font-mono print:border-black print:text-black"
                      >
                        {ing.name} <span className="text-accent-lime font-bold">{ing.amount}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase font-bold text-zinc-500 mb-2 print:text-black">Ejecución</h4>
                  <p className="text-zinc-300 text-sm font-mono leading-relaxed print:text-black">{sub.process}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
