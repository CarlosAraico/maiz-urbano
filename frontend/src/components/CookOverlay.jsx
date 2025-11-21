import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function CookOverlay({ recipe, onClose }) {
  const [step, setStep] = useState(0);
  const dialogRef = useRef();

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  const next = () => step < recipe.steps.length - 1 ? setStep(step + 1) : onClose();
  const prev = () => setStep(Math.max(0, step - 1));

  return (
    <div
      className="fixed inset-0 bg-black/95 z-[60] text-white font-sans flex flex-col no-print"
      role="dialog"
      aria-modal="true"
      aria-label={`Modo cocina para ${recipe.title}`}
      tabIndex="-1"
      ref={dialogRef}
    >
      <header className="flex justify-between items-center p-6 border-b border-border bg-card">
        <div>
          <span className="text-xs font-bold text-accent-lime uppercase tracking-widest">Live Cooking</span>
          <h2 className="text-2xl font-black uppercase">{recipe.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-3 bg-border rounded-full hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-accent-lime"
          aria-label="Cerrar modo cocina"
        >
          <X />
        </button>
      </header>

      <div className="flex-1 flex flex-col justify-center p-8 md:p-16 relative overflow-hidden">
        <div className="absolute top-10 right-10 text-[8rem] md:text-[10rem] font-black text-zinc-900 select-none opacity-50">
          {step + 1}
        </div>
        <div className="relative z-10 max-w-4xl mx-auto w-full text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-black uppercase text-accent-yellow">{recipe.steps[step].title}</h3>
          <p className="text-xl md:text-2xl font-medium text-zinc-300 leading-relaxed">
            {recipe.steps[step].description ?? recipe.steps[step].desc}
          </p>
        </div>
      </div>

      <footer className="p-6 border-t border-border bg-card flex flex-wrap gap-3 justify-between items-center">
        <button
          disabled={step === 0}
          onClick={prev}
          className="px-6 py-3 border border-border text-zinc-300 font-bold uppercase rounded-lg disabled:opacity-30 hover:bg-border focus:outline-none focus:ring-2 focus:ring-accent-lime"
        >
          Anterior
        </button>

        <div className="flex gap-2" aria-label="Progreso">
          {recipe.steps.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full ${i === step ? 'bg-accent-lime' : 'bg-zinc-700'}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="px-6 py-3 bg-accent-lime text-black font-black uppercase rounded-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-accent-lime"
        >
          {step < recipe.steps.length - 1 ? 'Siguiente' : 'Terminar'}
        </button>
      </footer>
    </div>
  );
}
