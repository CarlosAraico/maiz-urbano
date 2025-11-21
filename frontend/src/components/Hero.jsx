export default function Hero({ onPrimary, onSecondary }) {
  return (
    <header className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-text relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/confectionary.png')]" aria-hidden />

      <div className="flex justify-between items-center p-6 z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent-yellow rounded-sm flex items-center justify-center font-black text-black text-xl -rotate-3 border-2 border-white shadow-[4px_4px_0px_white]">
            M
          </div>
          <span className="font-black tracking-tight text-3xl uppercase italic">
            Maíz<span className="text-accent-lime">Urbano</span>
          </span>
        </div>
        <span className="text-xs font-mono border border-border px-3 py-1 rounded-full uppercase">V.2025</span>
      </div>

      <div className="flex-1 w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6 pb-24 z-10">
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
          <span className="inline-block bg-accent-lime text-black text-xs font-black px-4 py-1 -rotate-2 shadow-[4px_4px_0px_black]">
            STREET FOOD GOURMET · TLAXCALA
          </span>
          <h1 className="text-6xl md:text-8xl font-display leading-[0.9]">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-accent-yellow to-yellow-700">MAÍZ</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-accent-lime to-green-700">URBANO</span>
          </h1>
          <p className="max-w-xl text-lg text-zinc-300">
            El elote callejero con técnica ancestral y estética de asfalto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <button
              onClick={onPrimary}
              className="flex-1 bg-accent-yellow text-black font-black py-4 px-6 uppercase tracking-wider rounded-lg shadow-[6px_6px_0px_rgba(255,255,255,0.2)] border-2 border-black focus:outline-none focus:ring-2 focus:ring-white transition hover:-translate-y-1"
            >
              Elote O.G.
            </button>
            <button
              onClick={onSecondary}
              className="flex-1 bg-transparent border-2 border-accent-lime text-accent-lime font-black py-4 px-6 uppercase tracking-wider rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-lime transition hover:bg-accent-lime hover:text-black"
            >
              Esquites
            </button>
          </div>
        </div>

        <div className="relative h-[420px] md:h-[560px] flex items-center justify-center">
          <div className="absolute inset-0 bg-accent-yellow/10 blur-[90px] rounded-full scale-75" aria-hidden />
          <img
            src="Maiz_Urbano.jpg"
            alt="Personaje de maíz urbano"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1633328320102-19c7b4441782?q=80&w=1200&auto=format&fit=crop';
              e.target.style.borderRadius = '16px';
            }}
            className="relative w-full h-full object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.7)] rotate-2 rounded-3xl bg-black/30"
          />
          <div className="absolute bottom-6 right-6 bg-black text-white font-black text-xs px-4 py-2 rotate-6 border border-white shadow-[4px_4px_0px_#84cc16]">
            CHEF APPROVED
          </div>
        </div>
      </div>
    </header>
  );
}
