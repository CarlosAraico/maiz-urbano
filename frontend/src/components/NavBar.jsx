import { Droplet, Flame, Zap, ChefHat } from 'lucide-react';

const tabs = [
  { id: 'home', label: 'Inicio', icon: Zap },
  { id: 'elote', label: 'Elote', icon: Flame },
  { id: 'esquites', label: 'Esquites', icon: Droplet },
  { id: 'subrecipes', label: 'Hacks', icon: ChefHat },
  { id: 'admin', label: 'Admin', icon: ChefHat }
];

export default function NavBar({ view, setView }) {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md border border-border rounded-full px-4 py-2 flex gap-2 shadow-lg no-print"
    >
      {tabs.map(({ id, label, icon: Icon }) => {
        const active = view === id;
        return (
          <button
            key={id}
            onClick={() => setView(id)}
            aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase rounded-full focus:outline-none focus:ring-2 focus:ring-accent-lime transition ${
              active ? 'bg-accent-lime text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
