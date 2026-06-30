import { Bot, CreditCard, Headphones, LayoutDashboard, LogOut, Moon, Settings, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

const nav = [
  { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
  { id: 'billing', label: 'Faturas', icon: CreditCard },
  { id: 'support', label: 'Suporte', icon: Headphones },
  { id: 'ai', label: 'IA', icon: Bot },
  { id: 'admin', label: 'Admin', icon: Settings }
];

export function AppLayout({ page, setPage, children }) {
  const { customer, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">T</div>
          <div>
            <strong>Tubaron</strong>
            <span>Central do Assinante</span>
          </div>
        </div>
        <nav>
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button className={page === item.id ? 'active' : ''} key={item.id} onClick={() => setPage(item.id)}>
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <span>Olá, {customer?.name?.split(' ')[0] || 'cliente'}</span>
            <strong>Como podemos simplificar seu dia?</strong>
          </div>
          <div className="top-actions">
            <button aria-label="Alternar tema" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button aria-label="Sair" onClick={logout}><LogOut size={18} /></button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
